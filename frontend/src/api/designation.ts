import api from "./client";

export type DesignationPayload = {
  designation_id?: number;
  designation_name: string;
  description: string;
  status: "Active" | "Inactive";
};

export type DesignationItem = {
  id: number;
  designation_name: string;
  description: string;
  status: "Active" | "Inactive";
};

export type CreateDesignationResponse = {
  success: boolean;
  message: string;
  data: {
    insertId: number;
    affectedRows?: number;
  };
};

export type GetDesignationsResponse = {
  success: boolean;
  data: DesignationItem[];
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

export const getDesignations = () =>
  api.get<GetDesignationsResponse>("/api/designations");

export const createDesignation = (designation: DesignationPayload) =>
  api.post<CreateDesignationResponse>("/api/designations", designation);

export const updateDesignation = (id: number, designation: DesignationPayload) =>
  api.put<UpdateDesignationResponse>(`/api/designations/${id}`, designation);

export const deleteDesignation = (id: number) =>
  api.delete<DeleteDesignationResponse>(`/api/designations/${id}`);
