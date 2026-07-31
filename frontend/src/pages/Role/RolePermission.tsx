import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import { getRolePermissions, saveRolePermissions } from "../../api/role";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../components/ui/form";

const permissionGroups = [
  {
    module: "Dashboard",
    permissions: ["dashboard.view"],
  },
  {
    module: "Employee",
    permissions: [
      "employee.view",
      "employee.create",
      "employee.update",
      "employee.delete",
    ],
  },
  {
    module: "Designation",
    permissions: [
      "designation.view",
      "designation.create",
      "designation.update",
      "designation.delete",
    ],
  },
  {
    module: "Task",
    permissions: [
      "task.view",
      "task.create",
      "task.update",
      "task.delete",
      "task.change_status",
    ],
  },
];

const schema = z.object({
  permissions: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

const RolePermission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      permissions: [],
    },
  });

  useEffect(() => {
    if (!id) return;

    const loadPermissions = async () => {
      try {
        const response = await getRolePermissions(id);

        form.reset({
          permissions: response.data.data.permissions || [],
        });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load permissions."
        );
      }
    };

    loadPermissions();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    try {
      await saveRolePermissions(id, values.permissions);

      toast.success("Permissions saved successfully.");

      // Redirect to Role List
      navigate("/roles");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save permissions."
      );
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Role Permissions</CardTitle>
            <Button type="button" variant="outline" onClick={() => navigate("/roles")}>
              Close
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Assign permissions to this role.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <>
                    {permissionGroups.map((group) => (
                      <div
                        key={group.module}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <h3 className="font-semibold text-lg">
                          {group.module}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          {group.permissions.map((permission) => (
                            <FormField
                              key={permission}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                const checked =
                                  field.value.includes(permission);

                                return (
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(value) => {
                                          if (value) {
                                            field.onChange([
                                              ...field.value,
                                              permission,
                                            ]);
                                          } else {
                                            field.onChange(
                                              field.value.filter(
                                                (item) =>
                                                  item !== permission
                                              )
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>

                                    <FormLabel className="cursor-pointer capitalize">
                                      {permission
                                        .split(".")[1]
                                        .replace("_", " ")}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit">
                  Save Permissions
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

export default RolePermission;