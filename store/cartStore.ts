import { create } from "zustand";

// Store finale
export const useCartStore = create<{
  count: number;
  setCount: (value: number) => void;
  increment: () => void;
  decrement: () => void;
  add: (value: number) => void;
  reset: () => void;
}>((set) => ({
  count: 0,
  setCount: (value) => set({ count: value }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  add: (value: number) => set((state) => ({ count: state.count + value })),
  reset: () => set({ count: 0 }),
}));
