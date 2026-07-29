import api from "./client";

export type TaskPayload = {
  task_code: string;
  title: string;
  description: string;
  employee_id: string;
  priority: "Low" | "Medium" | "High";
  due_date: string;
  status: "Pending" | "In Progress" | "Completed";
};

export type TaskItem = TaskPayload & {
  id: string;
};

export type CreateTaskResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
};

export type GetTasksResponse = {
  success: boolean;
  data: TaskItem[];
};

export type TaskFilters = {
  search?: string;
  status?: TaskPayload["status"];
  priority?: TaskPayload["priority"];
  employee_id?: string;
  designation_id?: string;
};

export type UpdateTaskResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export type DeleteTaskResponse = {
  success: boolean;
  message: string;
  data: {
    affectedRows: number;
  };
};

export const getTasks = (params?: TaskFilters) =>
  api.get<GetTasksResponse>("/api/tasks", { params });

export const createTask = (task: TaskPayload) =>
  api.post<CreateTaskResponse>("/api/tasks", task);

export const updateTask = (id: string, task: TaskPayload) =>
  api.put<UpdateTaskResponse>(`/api/tasks/${id}`, task);

export const deleteTask = (id: string) =>
  api.delete<DeleteTaskResponse>(`/api/tasks/${id}`);
