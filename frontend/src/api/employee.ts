import axios from "axios";

export type EmployeePayload = {
  id: number;
  employee_code: string;
  employee_name: string;
  designation_id: number;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

export type EmployeeItem = {
  id: number;
  employee_code: string;
  employee_name: string;
  designation_name?: string;
  designation_id: number;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

export type CreateEmployeeResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
};

export type GetEmployeesResponse = {
  success: boolean;
  data: EmployeeItem[];
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

export const getEmployees = () => axios.get<GetEmployeesResponse>("/api/employees");

export const createEmployee = (employee: EmployeePayload) =>
  axios.post<CreateEmployeeResponse>("/api/employees", employee);

export const updateEmployee = (id: number, employee: EmployeePayload) =>
  axios.put<UpdateEmployeeResponse>(`/api/employees/${id}`, employee);

export const deleteEmployee = (id: number) =>
  axios.delete<DeleteEmployeeResponse>(`/api/employees/${id}`);
