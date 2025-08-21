//! Note: To compile this, you'll need to add `candid` and `serde` to your `Cargo.toml`.
//!
//! ```toml
//! [dependencies]
//! candid = "0.10"
//! serde = { version = "1.0", features = ["derive"] }
//! ```

use ic_cdk::{query, update, caller, export::candid::{CandidType, Principal}};
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::HashMap;

// --- Data Types ---

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

// --- Canister State ---

// We will use a HashMap to store heroes, mapping a HeroId to a Hero struct.
// A counter will be used to generate unique IDs for new heroes.
thread_local! {
    static HEROES: RefCell<HashMap<HeroId, Hero>> = RefCell::new(HashMap::new());
    static NEXT_ID: RefCell<HeroId> = RefCell::new(0);
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
    let new_id = NEXT_ID.with(|next_id| {
        let id = *next_id.borrow();
        *next_id.borrow_mut() += 1;
        id
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
    HEROES.with(|heroes| heroes.borrow().get(&id).cloned())
}

// Retrieves all heroes.
// Note: For a production app with many heroes, you'd want to implement pagination.
#[query]
fn get_all_heroes() -> Vec<(HeroId, Hero)> {
    HEROES.with(|heroes| {
        heroes.borrow()
            .iter()
            .map(|(id, hero)| (*id, hero.clone()))
            .collect()
    })
}

// Updates an existing hero. Only the owner of the hero can update it.
#[update]
fn update_hero(id: HeroId, name: String, superpower: String) -> Result<(), String> {
    HEROES.with(|heroes| {
        let mut heroes_mut = heroes.borrow_mut();
        if let Some(hero) = heroes_mut.get_mut(&id) {
            // Authorization check: only the owner can update.
            if hero.owner != caller() {
                return Err("Only the owner can update this hero.".to_string());
            }
            hero.name = name;
            hero.superpower = superpower;
            Ok(())
        } else {
            Err("Hero not found.".to_string())
        }
    })
}

// Deletes a hero. Only the owner can delete it.
#[update]
fn delete_hero(id: HeroId) -> Result<(), String> {
    HEROES.with(|heroes| {
        // First, check if the hero exists and if the caller is the owner.
        if let Some(hero) = heroes.borrow().get(&id) {
            if hero.owner != caller() {
                return Err("Only the owner can delete this hero.".to_string());
            }
        } else {
            return Err("Hero not found.".to_string());
        }

        // If the checks pass, remove the hero.
        if heroes.borrow_mut().remove(&id).is_some() {
            Ok(())
        } else {
            // This case should theoretically not be reached due to the checks above.
            Err("Failed to delete hero.".to_string())
        }
    })
}