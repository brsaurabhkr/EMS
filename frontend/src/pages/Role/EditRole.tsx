import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { getRole, updateRole } from "../../api/role";

import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

// import api from "@/api/client";

const roleSchema = z.object({
  roleName: z
    .string()
    .min(2, "Role Name must be at least 2 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),

  status: z.enum(["Active", "Inactive"]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (!id) return;
    getRole(id).then((response) => form.reset(response.data.data)).catch((error) => toast.error(error.response?.data?.message || "Unable to load role."));

  }, [form, id]);

  const onSubmit = async (values: RoleFormValues) => {
    if (!id) return;
    try {
      await updateRole(id, values);
      toast.success("Role updated successfully.");
      navigate("/roles");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to update role.");
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Role</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Role Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Enter Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="Active">
                          Active
                        </SelectItem>

                        <SelectItem value="Inactive">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit">
                  Update Role
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/roles")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRole;
