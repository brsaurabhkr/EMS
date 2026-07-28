import api from "./client";

export type TaskPayload = {
  task_id: string;
  task_code: string;
  title: string;
  description: string;
  employee_id: number;
  priority: "Low" | "Medium" | "High";
  due_date: string;
  status: "Pending" | "In Progress" | "Completed";
};

export type TaskItem = TaskPayload & {
  id: number;
};

export type CreateTaskResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
};

export type GetTasksResponse = {
  success: boolean;
  data: TaskItem[];
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

export const getTasks = () =>
  api.get<GetTasksResponse>("/api/tasks");

export const createTask = (task: TaskPayload) =>
  api.post<CreateTaskResponse>("/api/tasks", task);

export const updateTask = (id: number, task: TaskPayload) =>
  api.put<UpdateTaskResponse>(`/api/tasks/${id}`, task);

export const deleteTask = (id: number) =>
  api.delete<DeleteTaskResponse>(`/api/tasks/${id}`);
