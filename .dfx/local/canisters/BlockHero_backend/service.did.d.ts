import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'check_user_registered' : ActorMethod<[Principal], boolean>,
  'login' : ActorMethod<[Principal, string, string], boolean>,
  'read_file' : ActorMethod<[string, Principal], string>,
  'read_logs' : ActorMethod<
    [bigint, string],
    Array<[string, Principal, string, string, string]>
  >,
  'register_user' : ActorMethod<[Principal, string, string, number], undefined>,
  'upload_file' : ActorMethod<[string, string, number], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
