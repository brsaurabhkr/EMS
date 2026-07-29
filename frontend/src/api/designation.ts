import api from "./client";

export type DesignationPayload = {
  designation_name: string;
  description: string;
  status: "Active" | "Inactive";
};

export type DesignationItem = {
  id: string;
  designation_name: string;
  description: string;
  status: "Active" | "Inactive";
};

export type CreateDesignationResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
};

export type GetDesignationsResponse = {
  success: boolean;
  data: DesignationItem[];
};

export type DesignationFilters = {
  search?: string;
  status?: "Active" | "Inactive";
};

export type UpdateDesignationResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export type DeleteDesignationResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export const getDesignations = (params?: DesignationFilters) =>
  api.get<GetDesignationsResponse>("/api/designations", { params });

export const createDesignation = (designation: DesignationPayload) =>
  api.post<CreateDesignationResponse>("/api/designations", designation);

export const updateDesignation = (id: string, designation: DesignationPayload) =>
  api.put<UpdateDesignationResponse>(`/api/designations/${id}`, designation);

export const deleteDesignation = (id: string) =>
  api.delete<DeleteDesignationResponse>(`/api/designations/${id}`);
