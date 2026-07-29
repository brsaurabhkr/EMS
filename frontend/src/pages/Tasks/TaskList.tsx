import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { deleteTask as apiDeleteTask, getTasks as apiGetTasks, updateTask as apiUpdateTask, createTask } from "../../api/task";
import { useTaskStore } from "../../store/taskStore";

// Shadcn UI Components
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";

const taskSchema = z.object({
  code: z.string().min(1, "Task code is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description is too short"),
  employee_id: z.string().min(1, "Please assign an employee"),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((value) => {
      const { minimum, maximum } = getDueDateRange();
      return value >= minimum && value <= maximum;
    }, "Due date must be between today and the next 30 days"),
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDueDateRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maximumDate = new Date(today);
  maximumDate.setDate(maximumDate.getDate() + 30);
  return { minimum: formatLocalDate(today), maximum: formatLocalDate(maximumDate) };
}

const defaultTaskFormValues: TaskFormValues = {
  code: "",
  title: "",
  description: "",
  employee_id: "",
  priority: "Medium",
  dueDate: getDueDateRange().minimum,
  status: "Pending",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const data = (error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } })?.response?.data;
  return data?.errors?.[0]?.message || data?.message || fallback;
};

const getAssignedEmployeeLabel = (employees: any[], employeeId: string) => {
  const employee = employees.find((e: any) => e.id === employeeId);
  if (!employee) return "Unassigned";
  return `${employee.name} (Designation ID: ${employee.designationId})`;
};

const Task = ({ employees }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { tasks, setTasks, addTask, updateTask, deleteTask } = useTaskStore();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultTaskFormValues,
  });

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  const openCreateForm = () => {
    setEditId(null);
    reset(defaultTaskFormValues);
    setShowForm(true);
  };

  const openEditForm = (task: any) => {
    setEditId(task.id);
    reset({ ...task, employee_id: String(task.employee_id) }, { keepDefaultValues: true });
    setShowForm(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditId(null);
      reset(defaultTaskFormValues);
    }
  };

  useEffect(() => {
    apiGetTasks({
      search,
      status: filterStatus === "All" ? undefined : filterStatus as TaskFormValues["status"],
    })
      .then((response) => {
        const items = response.data.data.map((task) => ({
          id: String(task.id),
          code: task.task_code,
          title: task.title,
          description: task.description,
          employee_id: String(task.employee_id),
          priority: task.priority,
          dueDate: task.due_date,
          status: task.status,
        }));
        setTasks(items);
      })
      .catch((error) => {
        console.error("Failed to load tasks", error);
      });
  }, [search, filterStatus, setTasks]);

  const onSubmit = (values: TaskFormValues) => {
    const codeExists = tasks.some((task: any) => task.code.toLowerCase() === values.code.toLowerCase() && task.id !== editId);
    if (codeExists) {
      form.setError("code", { type: "manual", message: "Task Code already exists." });
      toast.error("Task Code already exists.");
      return;
    }

    // client-side validation: ensure selected employee exists
    const selectedEmployee = employees.find((e: any) => String(e.id) === String(values.employee_id));
    if (!selectedEmployee) {
      form.setError("employee_id", { type: "manual", message: "Selected employee not found." });
      toast.error("Selected employee not found.");
      return;
    }

    const payload = {
      task_code: values.code,
      title: values.title,
      description: values.description,
      employee_id: values.employee_id,
      priority: values.priority,
      due_date: values.dueDate,
      status: values.status,
    };

    if (editId !== null) {
      apiUpdateTask(editId, payload)
        .then(() => {
          updateTask({ id: editId, code: values.code, title: values.title, description: values.description, employee_id: values.employee_id, priority: values.priority, dueDate: values.dueDate, status: values.status });
          toast.success("Task updated!");
          setShowForm(false);
          reset(defaultTaskFormValues);
          setEditId(null);
        })
        .catch((error) => {
          console.error("Failed to update task", error);
          applyServerValidationErrors(error);
          toast.error(getErrorMessage(error, "Unable to update task"));
        });
      return;
    }

    createTask(payload)
      .then((response) => {
        const newId = response.data.data.id;
        addTask({ id: newId, ...values, employee_id: values.employee_id });
        toast.success("Task created!");
        setShowForm(false);
        reset(defaultTaskFormValues);
      })
      .catch((error) => {
        console.error("Failed to create task", error);
        applyServerValidationErrors(error);
        toast.error(getErrorMessage(error, "Unable to create task"));
      });
  };

  const applyServerValidationErrors = (error: unknown) => {
    const validationErrors = (error as { response?: { data?: { errors?: Array<{ field: string; message: string }> } } })?.response?.data?.errors;
    const fieldMap: Record<string, keyof TaskFormValues> = {
      task_code: "code",
      title: "title",
      description: "description",
      employee_id: "employee_id",
      priority: "priority",
      due_date: "dueDate",
      status: "status",
    };

    validationErrors?.forEach(({ field, message }) => {
      const formField = fieldMap[field];
      if (formField) form.setError(formField, { type: "server", message });
    });
  };

  const onInvalid = () => {
    toast.error("Complete all required task fields before saving.");
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      apiDeleteTask(taskToDelete)
        .then(() => {
          deleteTask(taskToDelete);
          toast.success("Task deleted!");
        })
        .catch((error) => {
          console.error("Failed to delete task", error);
          toast.error("Unable to delete task");
        });
    }
    setTaskToDelete(null);
  };

  return (
    <div className="bg-gray-50/50 min-h-full p-4 md:p-6 text-left">
      <h1 className="text-2xl font-bold mb-6">Task Management</h1>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6">
            <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 h-9" />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value ?? "All")}>
              <SelectTrigger className="w-full sm:w-40 h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreateForm} className="h-9 w-full sm:ml-auto sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </div>

          <div className="space-y-3 md:hidden">
            {tasks.filter((t: any) => (filterStatus === "All" || t.status === filterStatus) && (t.title.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()))).map((t: any) => (
              <Card key={t.id} className="border shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold truncate">{t.title}</p><p className="text-sm text-muted-foreground">{t.code}</p></div><Badge className="shrink-0">{t.status}</Badge></div>
                  <div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-muted-foreground">Assigned to</p><p className="truncate">{getAssignedEmployeeLabel(employees, t.employee_id)}</p></div><div><p className="text-muted-foreground">Due date</p><p>{t.dueDate}</p></div><div><p className="text-muted-foreground">Priority</p><p>{t.priority}</p></div></div>
                  <div className="flex gap-2"><Button className="flex-1" variant="outline" size="sm" onClick={() => openEditForm(t)}><Edit2 className="mr-1.5 h-4 w-4" />Edit</Button><Button className="flex-1" variant="destructive" size="sm" onClick={() => setTaskToDelete(t.id)}><Trash2 className="mr-1.5 h-4 w-4" />Delete</Button></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead><TableHead>Code</TableHead><TableHead>Title</TableHead><TableHead>Assigned To</TableHead><TableHead>Designation ID</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead>Due-Date</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.filter((t: any) => (filterStatus === "All" || t.status === filterStatus) && (t.title.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()))).map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell>{t.code}</TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{getAssignedEmployeeLabel(employees, t.employee_id)}</TableCell>
                    <TableCell>{employees.find((e: any) => e.id === t.employee_id)?.designationId ?? "—"}</TableCell>
                    <TableCell><Badge>{t.status}</Badge></TableCell>
                    <TableCell>{t.priority}</TableCell>
                    <TableCell>{t.dueDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditForm(t)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setTaskToDelete(t.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={handleFormOpenChange}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Create"} Task</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-4 py-4">
            
            <div className="space-y-1">
              <Label>Task Code</Label>
              <Input type="text" {...form.register("code" as any)} className={errors.code ? "border-red-500" : ""} />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input type="text" {...form.register("title" as any)} className={errors.title ? "border-red-500" : ""} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input
                type="date"
                min={getDueDateRange().minimum}
                max={getDueDateRange().maximum}
                {...form.register("dueDate" as any)}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea {...form.register("description")} className={errors.description ? "border-red-500" : ""} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Assigned To</Label>
                <Controller name="employee_id" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`w-22 ${errors.employee_id ? "border-red-500" : ""}`}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="w-96 max-w-full">
                      {employees.map((employee: any) => (
                        <SelectItem key={employee.id} value={String(employee.id)} className="whitespace-normal">
                          ID: {employee.id} · {employee.code} · {employee.name} · Designation ID: {employee.designationId} · {employee.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
                {errors.employee_id && <p className="text-xs text-red-500">{errors.employee_id.message}</p>}
              </div>

              <div className="space-y-1">
                <Label>Priority</Label>
                <Controller name="priority" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                  </Select>
                )} />
                {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
              </div>
            </div>

            {/* Added Status Select */}
            <div className="space-y-1">
              <Label>Status</Label>
              <Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )} />
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <DialogFooter><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Task"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={taskToDelete !== null} onOpenChange={(open) => { if (!open) setTaskToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The task will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Task;
