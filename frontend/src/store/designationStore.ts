import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const useDesignationStore = create<DesignationStore>()(
  persist(
    (set) => ({
      designations: [
        { id: 1, name: "Admin", description: "System Administrator", status: "Active" },
        { id: 2, name: "HR", description: "Human Resource Department", status: "Active" },
        { id: 3, name: "Nurse", description: "Patient Care", status: "Inactive" },
      ],
      setDesignations: (designations) =>
        set({
          designations,
        }),
    }),
    { name: "designationsData",
      storage: createJSONStorage(() => sessionStorage),
     },
  ),
);
