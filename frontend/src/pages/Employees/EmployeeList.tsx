import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { createEmployee as apiCreateEmployee, deleteEmployee as apiDeleteEmployee, getEmployees as apiGetEmployees, updateEmployee as apiUpdateEmployee } from "../../api/employee";
import { useDesignationStore } from "../../store/designationStore";
import { useEmployeeStore } from "../../store/employeeStore";

// Shadcn UI Imports
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

// 1. Zod Schema
const employeeSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/, "Employee ID must be a positive whole number."),
  code: z.string().min(1, "Code is required."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  designation_id: z.string().min(1, "Please select a designation."),
  email: z.string().email("Invalid email address."),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  status: z.enum(["Active", "Inactive"]),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

const getErrorMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return message || fallback;
};

const Employee = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { designations } = useDesignationStore();
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const { employees, addEmployee, updateEmployee, deleteEmployee, setEmployees } = useEmployeeStore();

  const { register, handleSubmit, reset, control, setError, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { id: "", code: "", name: "", designation_id: "", email: "", mobile: "", status: "Active" },
  });

  const showApiValidationError = (error: unknown, fallback: string) => {
    const message = getErrorMessage(error, fallback);
    const validationErrors = (error as { response?: { data?: { errors?: Array<{ field: string; message: string }> } } })?.response?.data?.errors;
    const fieldMap: Record<string, keyof EmployeeFormValues> = {
      employee_code: "code",
      employee_name: "name",
      designation_id: "designation_id",
      email: "email",
      mobile: "mobile",
      status: "status",
      id: "id",
    };

    validationErrors?.forEach(({ field, message: fieldMessage }) => {
      const formField = fieldMap[field];
      if (formField) setError(formField, { type: "server", message: fieldMessage });
    });
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes("employee id")) {
      setError("id", { type: "server", message });
    } else if (normalizedMessage.includes("employee code")) {
      setError("code", { type: "server", message });
    } else if (normalizedMessage.includes("email")) {
      setError("email", { type: "server", message });
    } else if (normalizedMessage.includes("designation")) {
      setError("designation_id", { type: "server", message });
    } else if (normalizedMessage.includes("mobile")) {
      setError("mobile", { type: "server", message });
    }

    toast.error(message);
  };

  const handleOpenAddModal = () => {
    reset({ id: "", code: "", name: "", designation_id: "", email: "", mobile: "", status: "Active" });
    setEditId(null);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    apiGetEmployees()
      .then((response) => {
        const items = response.data.data.map((item: any) => ({
          id: item.id,
          employee_code: item.employee_code,
          employee_name: item.employee_name,
          code: item.employee_code,
          name: item.employee_name,
          designationId: Number(item.designation_id),
          designation_id: Number(item.designation_id),
          designation: item.designation_name || designations.find((designation) => designation.id === item.designation_id)?.name || "",
          email: item.email,
          mobile: item.mobile,
          status: item.status,
        }));
        setEmployees(items);
      })
      .catch((error) => {
        console.error("Failed to load employees", error);
        toast.error("Unable to load employees");
      });
  }, [designations, setEmployees]);

  const handleEdit = (item: any) => {
    setEditId(item.id);
    reset({ ...item, id: String(item.id), designation_id: String(item.designationId) });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: EmployeeFormValues) => {
    const codeExists = employees.some((item: any) => item.code.toLowerCase() === data.code.toLowerCase() && item.id !== editId);
    if (codeExists) {
      setError("code", { type: "manual", message: "This employee code already exists!" });
      toast.error("Error", { description: "Code already exists!" });
      return;
    }

    const employeeId = Number(data.id);
    const idExists = employees.some((item: any) => item.id === employeeId && item.id !== editId);
    if (idExists) {
      setError("id", { type: "manual", message: "This employee ID already exists!" });
      toast.error("Employee ID already exists!");
      return;
    }

    const emailExists = employees.some(
      (item: any) => item.email.toLowerCase() === data.email.toLowerCase() && item.id !== editId
    );
    if (emailExists) {
      setError("email", { type: "manual", message: "This email address is already in use!" });
      toast.error("This email address is already in use!");
      return;
    }

    const selectedDesignation = designations.find((designation) => String(designation.id) === data.designation_id);
    const uiPayload = {
      id: employeeId,
      employee_code: data.code,
      employee_name: data.name,
      code: data.code,
      name: data.name,
      designationId: Number(data.designation_id),
      designation_id: Number(data.designation_id),
      designation: selectedDesignation ? selectedDesignation.name : "",
      email: data.email,
      mobile: data.mobile,
      status: data.status,
    };

    const apiPayload = {
      id: employeeId,
      employee_code: data.code,
      employee_name: data.name,
      designation_id: Number(data.designation_id),
      email: data.email,
      mobile: data.mobile,
      status: data.status,
    };

    if (editId !== null) {
      apiUpdateEmployee(editId, apiPayload)
        .then(() => {
          updateEmployee({ ...uiPayload, id: editId });
          toast.success("Success", { description: "Employee updated successfully." });
          setIsDialogOpen(false);
        })
        .catch((error) => {
          console.error("Failed to update employee", error);
          showApiValidationError(error, "Unable to update employee");
        });
    } else {
      apiCreateEmployee(apiPayload)
        .then((response) => {
          const newId = response.data.data?.id ?? employeeId;
          addEmployee({ ...uiPayload, id: newId });
          toast.success("Success", { description: "Employee added successfully." });
          setIsDialogOpen(false);
        })
        .catch((error) => {
          console.error("Failed to create employee", error);
          showApiValidationError(error, "Unable to create employee");
        });
    }
  };

  const filteredData = employees.filter((item: any) => 
    item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase())
  );

  const availableDesignations = designations.filter(
    (designation) => !employees.some(
      (employee) => employee.designationId === designation.id && employee.id !== editId
    )
  );

  const confirmDelete = () => {
    if (employeeToDelete !== null) {
      apiDeleteEmployee(employeeToDelete)
        .then(() => {
          deleteEmployee(employeeToDelete);
          toast.success("Success", { description: "Employee deleted successfully." });
        })
        .catch((error) => {
          console.error("Failed to delete employee", error);
          toast.error("Unable to delete employee");
        });
    }
    setEmployeeToDelete(null);
  };

  return (
    <div className="bg-gray-50/50 min-h-full p-4 md:p-6 text-left">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Employee Management</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={handleOpenAddModal} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle>{editId !== null ? "Edit Employee" : "Add Employee"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 py-4">
                {["id", "code", "name", "email", "mobile"].map((field) => (
                  <div key={field} className="space-y-1">
                    <Label className="capitalize">{field === "id" ? "Employee ID" : field}</Label>
                    <Input
                      type={field === "id" ? "number" : "text"}
                      min={field === "id" ? 1 : undefined}
                      disabled={field === "id" && editId !== null}
                      {...register(field as any)}
                      className={errors[field as keyof EmployeeFormValues] ? "border-red-500" : ""}
                    />
                    {errors[field as keyof EmployeeFormValues] && <p className="text-red-500 text-xs">{errors[field as keyof EmployeeFormValues]?.message}</p>}
                  </div>
                ))}
                
                <div className="space-y-1">
                  <Label>Designation</Label>
                  <Controller name="designation_id" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.designation_id ? "border-red-500" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {availableDesignations.map((designation) => (
                          <SelectItem key={designation.id} value={String(designation.id)}>
                            {designation.id} - {designation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.designation_id && <p className="text-red-500 text-xs">{errors.designation_id.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Status</Label>
                  <Controller name="status" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
                    </Select>
                  )} />
                  {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                </div>

                <DialogFooter><Button type="submit">{editId !== null ? "Update" : "Save"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <div className="space-y-3 md:hidden">
            {filteredData.map((emp: any) => (
              <Card key={emp.id} className="border shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">Employee ID: {emp.id} · {emp.code}</p>
                    </div>
                    <Badge className="shrink-0" variant={emp.status === "Active" ? "default" : "secondary"}>{emp.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Designation ID</p><p>{emp.designationId}</p></div>
                    <div><p className="text-muted-foreground">Designation Name</p><p className="truncate">{emp.designation}</p></div>
                    <div><p className="text-muted-foreground">Mobile</p><p className="truncate">{emp.mobile}</p></div>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{emp.email}</p>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" size="sm" onClick={() => handleEdit(emp)}><Edit2 className="mr-1.5 h-4 w-4" />Edit</Button>
                    <Button className="flex-1" variant="destructive" size="sm" onClick={() => setEmployeeToDelete(emp.id)}><Trash2 className="mr-1.5 h-4 w-4" />Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredData.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No employees found.</p>}
          </div>

          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((emp: any) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.id}</TableCell>
                    <TableCell>{emp.code}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.designationId}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.mobile}</TableCell>
                    <TableCell><Badge variant={emp.status === "Active" ? "default" : "secondary"}>{emp.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setEmployeeToDelete(emp.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No employees found.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={employeeToDelete !== null} onOpenChange={(open) => { if (!open) setEmployeeToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The employee will be permanently removed.</AlertDialogDescription>
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

export default Employee;
