import { create } from "zustand";

export type Task = {
  id: string;
  code: string;
  title: string;
  description: string;
  employee_id: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
};

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map((item) => item.id === task.id ? task : item),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
}));
