use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{query, update, caller};
use std::borrow::Cow;
use std::cell::RefCell;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable, StableCell, storable::Bound};

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

// --- Canister Functions ---

// A simple query function that takes a name and returns a greeting.
#[query]
fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to BlockHero.", name)
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