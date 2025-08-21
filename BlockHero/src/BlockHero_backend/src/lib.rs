use ic_cdk::{query, update};
use std::cell::RefCell;

// A simple query function that takes a name and returns a greeting.
#[query]
fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to BlockHero.", name)
}

// --- New additions for state management ---

// Use a thread-local RefCell to manage mutable state.
// This is the standard way to hold state in a canister.
thread_local! {
    static COUNTER: RefCell<u64> = RefCell::new(0);
}

// A query function to get the current value of the counter.
#[query]
fn get() -> u64 {
    COUNTER.with(|counter| *counter.borrow())
}

// An update function to increment the counter.
// Update calls can modify state, while query calls cannot.
#[update]
fn inc() {
    COUNTER.with(|counter| *counter.borrow_mut() += 1);
}