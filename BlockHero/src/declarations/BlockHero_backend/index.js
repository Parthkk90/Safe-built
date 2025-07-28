

import { Actor, HttpAgent } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./BlockHero_backend.did.js";
export { idlFactory } from "./BlockHero_backend.did.js";

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
export const canisterId =
  process.env.CANISTER_ID_BLOCKHERO_BACKEND;

export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ 
    host: "http://127.0.0.1:8000", // Try port 8000 if 4943 doesn't work
    ...options.agentOptions 
  });

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const BlockHero_backend = canisterId ? createActor(canisterId) : undefined;



