import api from "./client";

export type EmployeePayload = {
  employee_code: string;
  employee_name: string;
  designation_id: string;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

export type EmployeeItem = {
  id: string;
  employee_code: string;
  employee_name: string;
  designation_name?: string;
  designation_id: string;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

export type CreateEmployeeResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
};

export type GetEmployeesResponse = {
  success: boolean;
  data: EmployeeItem[];
};

export type EmployeeFilters = {
  search?: string;
  status?: "Active" | "Inactive";
  designation_id?: string;
};

export type UpdateEmployeeResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export type DeleteEmployeeResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export const getEmployees = (params?: EmployeeFilters) => api.get<GetEmployeesResponse>("/api/employees", { params });

export const createEmployee = (employee: EmployeePayload) =>
  api.post<CreateEmployeeResponse>("/api/employees", employee);

export const updateEmployee = (id: string, employee: EmployeePayload) =>
  api.put<UpdateEmployeeResponse>(`/api/employees/${id}`, employee);

export const deleteEmployee = (id: string) =>
  api.delete<DeleteEmployeeResponse>(`/api/employees/${id}`);
