import { Pencil, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { deleteRole, getRoles, type Role } from "../../api/role";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const RoleList = () => {
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  useEffect(() => {
    getRoles({ search: search.trim() })
      .then((response) => setRoles(response.data.data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load roles."));
  }, [search]);

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete);
      setRoles((currentRoles) => currentRoles.filter((role) => role.id !== roleToDelete));
      toast.success("Role deleted successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to delete role.");
    } finally {
      setRoleToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions
          </p>
        </div>

        <Link to="/roles/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </Link>
      </div>

      {/* Search */}

      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="relative mb-5">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search Role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>Role Name</TableHead>

                <TableHead>Description</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {roles.length === 0 ? (

                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8"
                  >
                    No Roles Found
                  </TableCell>
                </TableRow>

              ) : (

                roles.map((role) => (

                  <TableRow key={role.id}>

                    <TableCell className="font-medium">
                      {role.roleName}
                    </TableCell>

                    <TableCell>
                      {role.description}
                    </TableCell>

                    <TableCell>

                      <Badge
                        variant={
                          role.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {role.status}
                      </Badge>

                    </TableCell>

                    <TableCell>

                      <div className="flex justify-end gap-2">

                        <Link to={`/roles/edit/${role.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link
                          to={`/roles/${role.id}/permissions`}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setRoleToDelete(role.id)}
                          aria-label={`Delete ${role.roleName}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

      <AlertDialog open={roleToDelete !== null} onOpenChange={(open) => { if (!open) setRoleToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The role and its permissions will be permanently removed.</AlertDialogDescription>
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

export default RoleList;
