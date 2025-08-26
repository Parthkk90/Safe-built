use std::collections::BTreeMap;
use std::cell::RefCell;

// --- State Management ---
thread_local! {
    // User management
    static USER_INFO_MAP: RefCell<BTreeMap<Principal, String>> = RefCell::new(BTreeMap::new());
    // ...other state variables as needed...
}


use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{query, update, caller};
use std::borrow::Cow;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, StableCell, storable::Bound};
use sha2::{Digest, Sha256};

// --- Data Types ---

// A type alias for the memory manager.
type Memory = VirtualMemory<DefaultMemoryImpl>;

// Define a unique ID for our heroes.
type HeroId = u64;

// Define the structure for a Hero.
// `CandidType` allows this struct to be passed over the canister boundary.
// `Deserialize` is needed for Candid.
// `Clone` is useful for easily working with copies of the data.
#[derive(CandidType, Deserialize, Clone)]
struct Hero {
    owner: Principal,
    name: String,
    superpower: String,
}

// --- Storable Trait Implementation for Hero ---
// This is required for storing the struct in stable memory.
impl Storable for Hero {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        // An estimated max size for a hero. This is a trade-off between memory usage
        // and flexibility. A Principal is 29 bytes max. We add space for names and superpowers.
        max_size: 256,
        is_fixed_size: false,
    };
}

// --- Custom Error Type ---
// Using a dedicated error enum is better than strings for error handling,
// making it more robust and easier for clients to handle.
#[derive(CandidType, Deserialize)]
enum Error {
    NotFound,
    NotAuthorized,
}

// --- Canister State ---

// We use stable structures to make our state persistent across canister upgrades.
thread_local! {
    // The memory manager is used for managing memory for stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // A stable B-tree map for storing heroes.
    // Key: HeroId (u64), Value: Hero
    static HEROES: RefCell<StableBTreeMap<HeroId, Hero, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    // A stable cell for the hero ID counter.
    static NEXT_ID: RefCell<StableCell<HeroId, Memory>> = RefCell::new(
        StableCell::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
            0 // Initial value for the counter
        ).expect("failed to initialize stable cell for NEXT_ID")
    );
}

// --- Simple user/file/log state (in-memory for local dev) ---

// Store basic user info by principal (user_id, pw_hash_hex, authority)
// NOTE: This is not stable across upgrades; sufficient for local dev/testing.
thread_local! {
    static FILES: RefCell<BTreeMap<String, (Principal, Vec<u8>, u8)>> = RefCell::new(BTreeMap::new());
    static LOGS: RefCell<Vec<LogEntry>> = RefCell::new(Vec::new());
}

// --- Canister Functions ---

// A simple query function that takes a name and returns a greeting.
#[query]
pub fn check_user_registered(identity: Principal) -> bool {
    USER_INFO_MAP.with(|map| map.borrow().contains_key(&identity))
}

// --- User management ---

#[derive(CandidType, Deserialize, Clone)]
struct LogEntry {
    timestamp: String,
    user: Principal,
    action: String,
    details: String,
    status: String,
}

fn log_event(user: Principal, action: &str, details: &str, status: &str) {
    let ts = ic_cdk::api::time(); // nanoseconds since epoch (u64)
    let entry = LogEntry {
        timestamp: ts.to_string(),
        user,
        action: action.to_string(),
        details: details.to_string(),
        status: status.to_string(),
    };
    LOGS.with(|logs| logs.borrow_mut().push(entry));
}

fn hash_password(pw: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(pw.as_bytes());
    let result = hasher.finalize();
    hex::encode(result)
}

#[update]
fn register_user(identity: Principal, user_id: String, user_pw: String, user_authority: u8) {
    let pw_hash = hash_password(&user_pw);
    USER_INFO_MAP.with(|map| {
        map.borrow_mut().insert(identity, format!("{}:{}:{}", user_id, pw_hash, user_authority));
    });
    log_event(identity, "register_user", &format!("id={}", user_id), "ok");
}

#[query]
fn login(identity: Principal, user_id: String, user_pw: String) -> bool {
    let found = USER_INFO_MAP.with(|map| map.borrow().get(&identity).cloned());
    if let Some(stored) = found {
        let mut parts = stored.splitn(3, ':');
        let id_ok = parts.next().map(|s| s == user_id).unwrap_or(false);
        let pw_hash_ok = {
            let stored_hash = parts.next().unwrap_or("");
            stored_hash == hash_password(&user_pw)
        };
        let ok = id_ok && pw_hash_ok;
        if ok {
            log_event(identity, "login", &format!("id={}", user_id), "ok");
        } else {
            log_event(identity, "login", &format!("id={}", user_id), "fail");
        }
        ok
    } else {
        log_event(identity, "login", &format!("id={}", user_id), "not_found");
        false
    }
}

// --- File ops (simple, local dev) ---

#[update]
fn upload_encrypted_file(title: String, content: Vec<u8>, file_authority: u8) {
    let owner = caller();
    FILES.with(|files| {
        files.borrow_mut().insert(title.clone(), (owner, content, file_authority));
    });
    log_event(owner, "upload_encrypted_file", &format!("title={}", title), "ok");
}

// Backward-compat alias for the frontend existing call name
#[update]
fn upload_file(title: String, content: Vec<u8>, file_authority: u8) {
    upload_encrypted_file(title, content, file_authority)
}

#[query]
fn read_file(title: String, identity: Principal) -> String {
    let maybe = FILES.with(|files| files.borrow().get(&title).cloned());
    if let Some((owner, content, file_authority)) = maybe {
        // Simple access: public if authority==0, or owner-only otherwise
        if file_authority == 0 || owner == identity {
            let text = String::from_utf8_lossy(&content).to_string();
            log_event(identity, "read_file", &format!("title={}", title), "ok");
            text
        } else {
            log_event(identity, "read_file", &format!("title={}", title), "forbidden");
            String::new()
        }
    } else {
        log_event(identity, "read_file", &format!("title={}", title), "not_found");
        String::new()
    }
}

#[query]
fn read_logs(limit: u64, order: String) -> Vec<LogEntry> {
    LOGS.with(|logs| {
        let mut items = logs.borrow().clone();
        if order.eq_ignore_ascii_case("desc") || order.eq_ignore_ascii_case("recent") {
            items.reverse();
        }
        items.into_iter().take(limit as usize).collect()
    })
}

#[derive(CandidType, Deserialize, Clone)]
struct EncKey { encrypted_key: Vec<u8> }

#[update]
fn get_encrypted_key(data: Vec<u8>) -> Result<EncKey, String> {
    // Placeholder: echo back the data as a fake "encrypted_key"
    Ok(EncKey { encrypted_key: data })
}
// Creates a new hero and adds it to our state.
#[update]
fn create_hero(name: String, superpower: String) -> HeroId {
    let owner = caller(); // The principal of the user calling this function.
    let new_id = NEXT_ID.with(|next_id_cell| {
        let current_id = *next_id_cell.borrow().get();
        next_id_cell.borrow_mut().set(current_id + 1)
            .expect("failed to update NEXT_ID");
        current_id
    });

    let hero = Hero {
        owner,
        name,
        superpower,
    };

    HEROES.with(|heroes| {
       heroes.borrow_mut().insert(new_id, hero);
    });

    new_id
}

// Retrieves a hero by its ID.
#[query]
fn get_hero(id: HeroId) -> Option<Hero> {
    HEROES.with(|heroes| heroes.borrow().get(&id))
}


// Retrieves all heroes.
// Note: For a production app with many heroes, you'd want to implement pagination.
#[query]
fn get_all_heroes() -> Vec<(HeroId, Hero)> {
    HEROES.with(|heroes| {
       heroes.borrow()
            .iter() // The iterator for StableBTreeMap yields (key, value) tuples.
            .collect()
    })
}

// Updates an existing hero. Only the owner of the hero can update it.
#[update]
fn update_hero(id: HeroId, name: String, superpower: String) -> Result<(), Error> {
   HEROES.with(|heroes| {
        match heroes.borrow().get(&id) {
            Some(mut hero) => {
                if hero.owner != caller() {
                    return Err(Error::NotAuthorized);
                }

                hero.name = name;
                hero.superpower = superpower;

                heroes.borrow_mut().insert(id, hero);
                Ok(())
            }
            None => Err(Error::NotFound),
        }
    })
}

// Export the Candid interface
ic_cdk::export_candid!();

// Deletes a hero. Only the owner can delete it.
#[update]
fn delete_hero(id: HeroId) -> Result<(), Error> {
    HEROES.with(|heroes| {
        match heroes.borrow().get(&id) {
            Some(hero) => {
                if hero.owner != caller() {
                    Err(Error::NotAuthorized)
                } else {
                    heroes.borrow_mut().remove(&id);
                    Ok(())
                }
            }
            None => Err(Error::NotFound),
        }
    })
}

// Candid UI compatibility: expose the candid interface via a query.
// Some local candid UIs fetch this method when metadata isn't available.
#[query(name = "__get_candid_interface_tmp_hack")]
fn __get_candid_interface_tmp_hack() -> String {
    include_str!("../BlockHero_backend.did").to_string()
}


























