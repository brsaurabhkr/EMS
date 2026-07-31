import api from "./client";

export type UserPayload = {
  employee_code: string;
  employee_name: string;
  designation_id: string;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

export type UserItem = {
  id: string;
  employee_code: string;
  employee_name: string;
  designation_name?: string;
  designation_id: string;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
  role?: string;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
};

export type GetUsersResponse = {
  success: boolean;
  data: UserItem[];
};

export type UserFilters = {
  search?: string;
  status?: "Active" | "Inactive";
  designation_id?: string;
};

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export const getUsers = (params?: UserFilters) => api.get<GetUsersResponse>("/api/employees", { params });

export const createUser = (user: UserPayload) =>
  api.post<CreateUserResponse>("/api/employees", user);

export const updateUser = (id: string, user: UserPayload) =>
  api.put<UpdateUserResponse>(`/api/employees/${id}`, user);

export const deleteUser = (id: string) =>
  api.delete<DeleteUserResponse>(`/api/employees/${id}`);
