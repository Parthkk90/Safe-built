export const idlFactory = ({ IDL }) => {
  const LogEntry = IDL.Record({
    'status' : IDL.Text,
    'action' : IDL.Text,
    'user' : IDL.Principal,
    'timestamp' : IDL.Text,
    'details' : IDL.Text,
  });
  return IDL.Service({
    'check_user_registered' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'get_encrypted_key' : IDL.Func(
        [IDL.Vec(IDL.Vec(IDL.Nat8))],
        [
          IDL.Variant({
            'Ok' : IDL.Record({ 'encrypted_key' : IDL.Vec(IDL.Nat8) }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
    'login' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [IDL.Bool],
        ['query'],
      ),
    'read_file' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Text], ['query']),
    'read_logs' : IDL.Func(
        [IDL.Nat64, IDL.Text],
        [IDL.Vec(LogEntry)],
        ['query'],
      ),
    'register_user' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text, IDL.Nat8],
        [],
        [],
      ),
    'upload_encrypted_file' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat8],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
