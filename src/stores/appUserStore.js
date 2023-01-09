import create from "zustand";

const useAppUserStore = create((set) => ({
    appUser: null,
    token: null,
    setAppUser: (appUser, token) => set({ appUser, token }),
}));

export default useAppUserStore;