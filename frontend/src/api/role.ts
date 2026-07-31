import api from "./client";

export type Role = { id: string; roleName: string; description: string; status: "Active" | "Inactive" };
export type RolePayload = Omit<Role, "id">;
export type RoleFilters = { search?: string };

export const getRoles = (params?: RoleFilters) => api.get<{ success: boolean; data: Role[] }>("/api/roles", { params });
export const getRole = (id: string) => api.get<{ success: boolean; data: Role }>(`/api/roles/${id}`);
export const createRole = (payload: RolePayload) => api.post("/api/roles", payload);
export const updateRole = (id: string, payload: RolePayload) => api.put(`/api/roles/${id}`, payload);
export const deleteRole = (id: string) => api.delete(`/api/roles/${id}`);
export const getRolePermissions = (id: string) => api.get<{ success: boolean; data: { permissions: string[] } }>(`/api/roles/${id}/permissions`);
export const saveRolePermissions = (id: string, permissions: string[]) => api.put(`/api/roles/${id}/permissions`, { permissions });
