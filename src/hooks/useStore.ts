import { create } from "zustand";

interface State {
  progress: number;
  ready: boolean;
  setProgress: (v: number) => void;
  setReady: () => void;
}

export const useStore = create<State>((set) => ({
  progress: 0,
  ready: false,
  setProgress: (v) => set({ progress: v }),
  setReady: () => set({ ready: true })
}));