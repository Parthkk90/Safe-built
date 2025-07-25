use candid::types::number::Nat;
use candid::types::principal::Principal;
use ic_cdk::{query, update};
use std::cell::RefCell;
use std::collections::BTreeMap;
use sha2::{Digest, Sha256};
use ic_cdk::api::time;
use std::sync::Mutex;
use types::{
    CanisterId, VetKDCurve, VetKDEncryptedKeyReply, VetKDEncryptedKeyRequest, VetKDKeyId,
    VetKDPublicKeyReply, VetKDPublicKeyRequest,
};

mod types;

const VETKD_SYSTEM_API_CANISTER_ID: &str = "s55qq-oqaaa-aaaaa-aaakq-cai";

thread_local! {
    pub static USER_INFO_MAP: RefCell<BTreeMap<Principal, String>> = RefCell::new(BTreeMap::new());
    pub static USER_AUTHORITY_MAP: RefCell<BTreeMap<Principal, u8>> = RefCell::new(BTreeMap::new());

    pub static FILE_MAP: RefCell<BTreeMap<String, String>> = RefCell::new(BTreeMap::new());
    pub static FILE_AUTHORITY_MAP: RefCell<BTreeMap<String, u8>> = RefCell::new(BTreeMap::new());

    pub static LOGS: RefCell<Vec<(String, Principal, String, String, String)>> = RefCell::new(Vec::new());

}

// Helper function for hashing
fn hash(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input);
    format!("{:x}", hasher.finalize())
}

// User-related functions
#[update]
fn register_user(identity: Principal, user_id: String, user_pw: String, user_athority: u8) {
    let hashed_id = hash(&(identity.to_text() + &user_id));
    let hashed_pw = hash(&(identity.to_text() + &user_pw));
    let final_hash = hash(&(hashed_id + &hashed_pw));

    USER_INFO_MAP.with(|map| map.borrow_mut().insert(identity.clone(), final_hash));
    USER_AUTHORITY_MAP.with(|map| map.borrow_mut().insert(identity, user_athority)); // 기본 권한 0 (최고 권한)
}

#[query]
fn check_user_registered(identity: Principal) -> bool {
    USER_INFO_MAP.with(|map| map.borrow().contains_key(&identity))
}

#[query]
fn login(identity: Principal, user_id: String, user_pw: String) -> bool {
    let hashed_id = hash(&(identity.to_text() + &user_id));
    let hashed_pw = hash(&(identity.to_text() + &user_pw));
    let final_hash = hash(&(hashed_id + &hashed_pw));

    USER_INFO_MAP.with(|map| {
        map.borrow()
            .get(&identity)
            .map_or(false, |stored_hash| stored_hash == &final_hash)
    })
}

// File-related functions
#[update]
fn upload_file(title: String, content: String, file_authority: u8) {
    FILE_MAP.with(|map| map.borrow_mut().insert(title.clone(), content));
    FILE_AUTHORITY_MAP.with(|map| map.borrow_mut().insert(title, file_authority));
}

#[query]
fn read_file(title: String, identity: Principal) -> String {
    let file_auth = FILE_AUTHORITY_MAP.with(|map| map.borrow().get(&title).cloned());
    let user_auth = USER_AUTHORITY_MAP.with(|map| map.borrow().get(&identity).cloned());

    match (file_auth, user_auth) {
        (Some(file_auth), Some(user_auth)) if user_auth <= file_auth => {
            let content = FILE_MAP.with(|map| map.borrow().get(&title).cloned().unwrap_or_default());

            create_log(identity.clone(), title.clone(), "READ".to_string());
            content
        }
        _ => "".to_string(),
    }
}

fn create_log(identity: Principal, title: String, action: String) {
     // Get the current timestamp in nanoseconds
     let timestamp_nanos = time();
     // Convert nanoseconds to seconds
     let timestamp_secs = timestamp_nanos / 1_000_000_000;
     // Format the timestamp as a human-readable string
     let timestamp = format!("{}", timestamp_secs);
    let user_id = USER_INFO_MAP.with(|map| map.borrow().get(&identity).cloned().unwrap_or_default());

    LOGS.with(|logs| {
        logs.borrow_mut()
            .push((timestamp, identity, user_id, title, action));
    });
}

#[query]
fn read_logs(limit: usize, order: String) -> Vec<(String, Principal, String, String, String)> {
    LOGS.with(|logs| {
        let mut logs = logs.borrow().clone();
        if order.to_lowercase() == "recent" {
            logs.reverse();
        }
        logs.into_iter().take(limit).collect()
    })
}

ic_cdk::export_candid!();
