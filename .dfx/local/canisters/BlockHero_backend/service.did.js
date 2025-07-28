export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'check_user_registered' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'login' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [IDL.Bool],
        ['query'],
      ),
    'read_file' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Text], ['query']),
    'read_logs' : IDL.Func(
        [IDL.Nat64, IDL.Text],
        [
          IDL.Vec(
            IDL.Tuple(IDL.Text, IDL.Principal, IDL.Text, IDL.Text, IDL.Text)
          ),
        ],
        ['query'],
      ),
    'register_user' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text, IDL.Nat8],
        [],
        [],
      ),
    'upload_file' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat8], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
