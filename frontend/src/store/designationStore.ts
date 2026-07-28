import { create } from "zustand";

export type Designation = {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
};

type DesignationStore = {
  designations: Designation[];
  setDesignations: (designations: Designation[]) => void;
};

export const useDesignationStore = create<DesignationStore>((set) => ({
  designations: [],
  setDesignations: (designations) => set({ designations }),
}));
