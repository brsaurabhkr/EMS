import axios from "axios";

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
  axios.get<GetDesignationsResponse>("/api/designation");

export const createDesignation = (designation: DesignationPayload) =>
  axios.post<CreateDesignationResponse>("/api/designation", designation);

export const updateDesignation = (id: number, designation: DesignationPayload) =>
  axios.put<UpdateDesignationResponse>(`/api/designation/${id}`, designation);

export const deleteDesignation = (id: number) =>
  axios.delete<DeleteDesignationResponse>(`/api/designation/${id}`);
