import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Employee = {
  id: number;
  employee_code: string;
  employee_name: string;
  code: string;
  name: string;
  designationId: number;
  designation_id: number;
  designation: string;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

type EmployeeStore = {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: number) => void;
};

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set) => ({
      employees: [
        { id: 1, employee_code: "EMP001", employee_name: "Rahul Sharma", code: "EMP001", name: "Rahul Sharma", designationId: 1, designation_id: 1, designation: "Admin", email: "rahul@gmail.com", mobile: "9876543210", status: "Active" },
      ],
      setEmployees: (employees) => set({ employees }),
      addEmployee: (employee) => set((state) => ({ employees: [...state.employees, { ...employee, designation_id: employee.designationId, id: employee.id ?? Date.now() }] })),
      updateEmployee: (employee) => set((state) => ({ employees: state.employees.map((item) => item.id === employee.id ? { ...employee, designation_id: employee.designationId } : item) })),
      deleteEmployee: (id) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
    }),
    {
      name: "employeesData",
      storage: createJSONStorage(() => sessionStorage),
    }
  ),
);
