import { create } from "zustand";

export const useStore = create((set) => ({
  count: 0,
  //   increasePopulation: () => set((state:any) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
  updateCount: (newValue: any) => set({ count: newValue }),

  
  isInProModel: false,
  updateModel: (updateVal: any) => set({ isInProModel: updateVal }),
}));

// import { create } from "zustand";

// // Define the store state type
// interface StoreState {
//   count: number;
//   isInProModel: boolean;
//   updateCount: (newValue: number) => void;
//   updateModel: (updateVal: boolean) => void;
// }

// export const useStore = create<StoreState>((set) => ({
//   count: 0,
//   isInProModel: false,
  
//   // Function to update count
//   updateCount: (newValue: number) => set({ count: newValue }),
  
//   // Function to update isInProModel
//   updateModel: (updateVal: boolean) => set({ isInProModel: updateVal }),
// }));
