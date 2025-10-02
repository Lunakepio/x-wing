import { create } from "zustand";

export const useStore = create((set) => ({
    playerPosition: null,
    setPlayerPosition: (playerPosition) => set({ playerPosition }),
}));