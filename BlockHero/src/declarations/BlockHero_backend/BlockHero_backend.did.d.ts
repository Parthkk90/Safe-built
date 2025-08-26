import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface LogEntry {
  'status' : string,
  'action' : string,
  'user' : Principal,
  'timestamp' : string,
  'details' : string,
}
export interface _SERVICE {
  'check_user_registered' : ActorMethod<[Principal], boolean>,
  'get_encrypted_key' : ActorMethod<
    [Array<Uint8Array | number[]>],
    { 'Ok' : { 'encrypted_key' : Uint8Array | number[] } } |
      { 'Err' : string }
  >,
  'login' : ActorMethod<[Principal, string, string], boolean>,
  'read_file' : ActorMethod<[string, Principal], string>,
  'read_logs' : ActorMethod<[bigint, string], Array<LogEntry>>,
  'register_user' : ActorMethod<[Principal, string, string, number], undefined>,
  'upload_encrypted_file' : ActorMethod<
    [string, Uint8Array | number[], number],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
