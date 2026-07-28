import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  createDesignation,
  deleteDesignation,
  getDesignations,
  updateDesignation,
} from "../../api/designation";
import { useDesignationStore } from "../../store/designationStore";

// Shadcn UI Imports
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";

// 1. Zod Schema
const designationSchema = z.object({
  designationId: z.string().min(1, "Designation ID is required").regex(/^[0-9]+$/, "Designation ID must be numeric"),
  name: z.string().min(1, "Please select a designation."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  status: z.enum(["Active", "Inactive"]),
});

type DesignationFormValues = z.infer<typeof designationSchema>;

const designationOptions = [
  "Admin",
  "HR",
  "Nurse",
  "Caregiver",
  "Housekeeping",
  "Receptionist",
];

const Designation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [designationToDelete, setDesignationToDelete] = useState<number | null>(null);
  const { designations, setDesignations } = useDesignationStore();

  useEffect(() => {
    getDesignations()
      .then((response) => {
        const items = response.data.data.map((item) => ({
          id: item.id,
          name: item.designation_name,
          description: item.description,
          status: item.status,
        }));
        setDesignations(items);
      })
      .catch((error) => {
        console.error("Failed to load designations", error);
      });
  }, []);

  // 2. React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<DesignationFormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      designationId: "",
      name: "",
      description: "",
      status: "Active",
    },
  });

  const handleOpenAddModal = () => {
    reset({ designationId: "", name: "", description: "", status: "Active" });
    setEditId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    reset({
      designationId: String(item.id),
      name: item.name,
      description: item.description,
      status: item.status as "Active" | "Inactive",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteDesignation(id)
      .then(() => {
        setDesignations(designations.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete designation", error);
      });
  };

  const confirmDelete = () => {
    if (designationToDelete !== null) handleDelete(designationToDelete);
    setDesignationToDelete(null);
  };

  const onSubmit = (data: DesignationFormValues) => {
    // Check for duplicate designation ID only
    const existsId = designations.some(
      (item) => String(item.id) === data.designationId && item.id !== editId
    );

    if (existsId) {
      setError("designationId", { type: "manual", message: "This designation ID is already used." });
      return;
    }

    if (editId !== null) {
      updateDesignation(editId, {
        designation_id: Number(data.designationId),
        designation_name: data.name,
        description: data.description,
        status: data.status,
      })
        .then(() => {
          setDesignations(
            designations.map((item) => (item.id === editId ? { ...item, ...data } : item))
          );
          setIsDialogOpen(false);
          setEditId(null);
        })
        .catch((error) => {
          console.error("Failed to update designation", error);
          setError("name", {
            type: "manual",
            message: "Unable to update designation. Try again.",
          });
        });
      return;
    }

    createDesignation({
      designation_id: Number(data.designationId),
      designation_name: data.name,
      description: data.description,
      status: data.status,
    })
      .then((response) => {
        const newId = Number(data.designationId) || response.data.data.insertId || designations.length + 1;
        setDesignations([...designations, { id: newId, ...data }]);
        setIsDialogOpen(false);
      })
      .catch((error: any) => {
        console.error("Failed to create designation", error);
        const message =
          error?.response?.data?.message ||
          "Unable to save designation. Try again.";

        if (message.includes("Designation ID")) {
          setError("designationId", { type: "manual", message });
        } else {
          setError("name", {
            type: "manual",
            message,
          });
        }
      });
  };

  const filteredData = designations.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50/50 min-h-full p-4 md:p-6 text-left">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Designation Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage employee designations for your organization.
        </p>
      </div>

      {/* Main Content Container */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0 sm:p-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 sm:p-0">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search designations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleOpenAddModal} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Designation
            </Button>
          </div>

          {/* Dialog / Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editId !== null ? "Edit Designation" : "Add Designation"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Designation ID</Label>
                    <Input
                      type="text"
                      {...register("designationId")}
                      placeholder="Enter unique ID"
                      className={errors.designationId ? "border-red-500" : ""}
                      disabled={editId !== null}
                    />
                    {errors.designationId && (
                      <p className="text-red-500 text-xs">{errors.designationId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Designation Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.name ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Designation" />
                          </SelectTrigger>
                          <SelectContent>
                            {designationOptions.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>
                </div>

                {/* Description - Textarea */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter description..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">{errors.description.message}</p>
                  )}
                </div>

                {/* Status - Select */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editId !== null ? "Update" : "Save"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Mobile View (Cards) */}
          <div className="space-y-4 md:hidden p-4 sm:p-0">
            {filteredData.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDesignationToDelete(item.id)}>
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredData.length === 0 && (
              <p className="text-center text-muted-foreground py-6">No designations found.</p>
            )}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "Active" ? "default" : "secondary"}
                          className={item.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDesignationToDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No designations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={designationToDelete !== null} onOpenChange={(open) => { if (!open) setDesignationToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete designation?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The designation will be permanently removed.</AlertDialogDescription>
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

export default Designation;
