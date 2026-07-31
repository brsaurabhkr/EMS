import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { createRole } from "../../api/role";

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

const roleSchema = z.object({
  roleName: z
    .string()
    .min(2, "Role Name must be at least 2 characters")
    .max(50, "Maximum 50 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(255, "Maximum 255 characters"),

  status: z.enum(["Active", "Inactive"]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const CreateRole = () => {
  const navigate = useNavigate();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      description: "",
      status: "Active",
    },
  });

  const onSubmit = async (values: RoleFormValues) => {
    try {
      await createRole(values);
      toast.success("Role created successfully.");
      navigate("/roles");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to create role.");
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Create Role</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Role Name */}

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

              {/* Description */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Enter Description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              <Button type="submit">
                Create Role
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRole;
