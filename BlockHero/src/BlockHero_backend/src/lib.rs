use candid::{CandidType, Principal};
use ic_cdk::{query, update};
use ic_cdk::api::time;
use serde::Deserialize;
use sha2::{Digest, Sha256};
use std::cell::RefCell;
use std::collections::BTreeMap;
use vetkd_system_api::{vetkd_encrypted_key, VetKDCurve, VetKDKeyId};

// --- Structs for State and Logging ---

#[derive(Clone, CandidType, Deserialize)]
pub struct LogEntry {
    timestamp: u64, // Use u64 for nanoseconds
    user: Principal,
    action: String,
    details: String,
    status: String, // e.g., "Success", "Failure"
}

#[derive(Clone, CandidType, Deserialize, PartialEq)]
pub enum LogOrder {
    Recent,
    Oldest,
}

// --- State Management ---

thread_local! {
    // User management
    static USER_INFO_MAP: RefCell<BTreeMap<Principal, String>> = RefCell::new(BTreeMap::new());
    static USER_AUTHORITY_MAP: RefCell<BTreeMap<Principal, u8>> = RefCell::new(BTreeMap::new());

    // File storage (now stores encrypted bytes)
    static FILE_MAP: RefCell<BTreeMap<String, Vec<u8>>> = RefCell::new(BTreeMap::new());
    static FILE_AUTHORITY_MAP: RefCell<BTreeMap<String, u8>> = RefCell::new(BTreeMap::new());

    // Logging
    static LOGS: RefCell<Vec<LogEntry>> = RefCell::new(Vec::new());
}

// --- Constants ---

// This should match the key configured in dfx.json
const VETKD_KEY_ID: VetKDKeyId = VetKDKeyId {
    curve: VetKDCurve::Bls12_381,
    name: "key_1".to_string(), // Make sure this matches dfx.json
};

// --- Helper Functions ---

fn hash(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input);
    format!("{:x}", hasher.finalize())
}

fn create_log(user: Principal, action: String, details: String, status: String) {
    let entry = LogEntry {
        timestamp: time(),
        user,
        action,
        details,
        status,
    };
    LOGS.with(|logs| logs.borrow_mut().push(entry));
}

// --- User Management Candid Methods ---

#[update]
fn register_user(user_id: String, user_pw: String, user_authority: u8) {
    let caller = ic_cdk::caller();
    let hashed_id = hash(&(caller.to_text() + &user_id));
    let hashed_pw = hash(&(caller.to_text() + &user_pw));
    let final_hash = hash(&(hashed_id + &hashed_pw));

    USER_INFO_MAP.with(|map| map.borrow_mut().insert(caller, final_hash));
    USER_AUTHORITY_MAP.with(|map| map.borrow_mut().insert(caller, user_authority));
    create_log(caller, "REGISTER".to_string(), format!("User registered with authority {}", user_authority), "Success".to_string());
}

#[query]
fn check_user_registered(identity: Principal) -> bool {
    USER_INFO_MAP.with(|map| map.borrow().contains_key(&identity))
}

#[update] // Changed from query to update because it modifies state (creates a log)
fn login(user_id: String, user_pw: String) -> bool { 
    let caller = ic_cdk::caller();
    let hashed_id = hash(&(caller.to_text() + &user_id));
    let hashed_pw = hash(&(caller.to_text() + &user_pw));
    let final_hash = hash(&(hashed_id + &hashed_pw));

    let is_valid = USER_INFO_MAP.with(|map| {
        map.borrow()
            .get(&caller)
            .map_or(false, |stored_hash| stored_hash == &final_hash)
    });

    if is_valid {
        create_log(caller, "LOGIN".to_string(), "User login successful".to_string(), "Success".to_string());
    } else {
        create_log(caller, "LOGIN".to_string(), "User login failed".to_string(), "Failure".to_string());
    }
    is_valid
}

// --- Encrypted File Management Candid Methods ---

#[update]
fn upload_file(title: String, content: Vec<u8>, file_authority: u8) {
    let caller = ic_cdk::caller();
    FILE_MAP.with(|map| map.borrow_mut().insert(title.clone(), content));
    FILE_AUTHORITY_MAP.with(|map| map.borrow_mut().insert(title.clone(), file_authority));
    create_log(caller, "UPLOAD".to_string(), format!("Uploaded file: {}", title), "Success".to_string());
}

#[update] // Changed from query to update because it modifies state (creates a log)
fn read_file(title: String) -> Option<Vec<u8>> { 
    let caller = ic_cdk::caller();
    let file_auth_opt = FILE_AUTHORITY_MAP.with(|map| map.borrow().get(&title).cloned());
    let user_auth_opt = USER_AUTHORITY_MAP.with(|map| map.borrow().get(&caller).cloned());

    match (file_auth_opt, user_auth_opt) {
        (Some(file_auth), Some(user_auth)) if user_auth <= file_auth => {
            let content = FILE_MAP.with(|map| map.borrow().get(&title).cloned());
            create_log(caller, "READ".to_string(), format!("Read file: {}", title), "Success".to_string());
            content
        }
        _ => {
            create_log(caller, "READ".to_string(), format!("Read access denied for file: {}", title), "Failure".to_string());
            None
        }
    }
}

// --- Logging Candid Methods ---

#[query]
fn read_logs(limit: usize, order: LogOrder) -> Vec<LogEntry> {
    LOGS.with(|logs| {
        let mut logs = logs.borrow().clone();
        if order == LogOrder::Recent {
            logs.reverse();
        }
        logs.into_iter().take(limit).collect()
    })
}

// --- vetKeys Candid Method ---

#[update]
async fn get_encrypted_symmetric_key_for_user(encryption_public_key: Vec<u8>) -> String {
    // Derive a key unique to the caller.
    // Using the principal is a secure and standard way to do this.
    let caller = ic_cdk::caller();
    let derivation_path = vec![caller.as_slice().to_vec()];

    // Request the encrypted key from the vetKD system API.
    let (encrypted_key,) = vetkd_encrypted_key(
        VETKD_KEY_ID,
        derivation_path,
        encryption_public_key,
    )
    .await
    .unwrap_or_else(|e| ic_cdk::trap(&format!("vetkd_encrypted_key failed: {:?}", e)));

    // Return the key to the frontend, hex-encoded for transport.
    hex::encode(encrypted_key)
}

// Export the Candid interface
ic_cdk::export_candid!();
