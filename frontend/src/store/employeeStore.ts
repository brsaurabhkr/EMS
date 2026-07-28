import { create } from "zustand";

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

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  setEmployees: (employees) => set({ employees }),
  addEmployee: (employee) => set((state) => ({ employees: [...state.employees, { ...employee, designation_id: employee.designationId }] })),
  updateEmployee: (employee) => set((state) => ({ employees: state.employees.map((item) => item.id === employee.id ? { ...employee, designation_id: employee.designationId } : item) })),
  deleteEmployee: (id) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
}));
