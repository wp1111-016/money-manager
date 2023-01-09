import create from "zustand";

const useAccountTableStore = create((set) => ({
  accountTable: null,
  accountNameTable: {},
  setAccountTable: (accounts) => {
    set({
      accountTable: accounts,
      accountNameTable: Object.fromEntries(
        accounts.map((account) => [account._id, account.name])
      )
    });
  },
}));

export default useAccountTableStore;