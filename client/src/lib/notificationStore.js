import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      set({ number: res.data });
    } catch {
      // silently ignore — don't crash if notifications fail
    }
  },
  decrease: () => {
    set((prev) => ({ number: Math.max(0, prev.number - 1) }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
