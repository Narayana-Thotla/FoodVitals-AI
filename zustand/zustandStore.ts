import { create } from "zustand";

export const useStore = create((set) => ({
  count: 0,
  updateCount: (newValue: any) => set({ count: newValue }),

  isInProModel: false,
  updateModel: (updateVal: any) => set({ isInProModel: updateVal }),
}));
