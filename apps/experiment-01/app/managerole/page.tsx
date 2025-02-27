"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Building, DollarSign, FileText, ChartBar, Bell, X, CalendarDays, Users, CheckCircle, Clock, TrendingUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/user-dropdown";
import { RiScanLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Define the Role type
interface Role {
  id: number;
  created_at: string;
  dashboard: boolean;
  contacts: boolean;
  manage_role: boolean;
  role_name: string;
}

export default function Page() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch roles from your API or Supabase
    const fetchRoles = async () => {
      const { data, error } = await supabase.from("Permissions").select("*");
      if (error) {
        console.error("Error fetching roles:", error);
      } else {
        setRoles(data as Role[]); // Cast the data to the Role type
        console.log(data);
      }
    };

    fetchRoles();
  }, []);

  const handleEditRole = (role: Role) => {
    // Handle edit role logic
    console.log("Edit role:", role);
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleViewRole = (role: Role) => {
    // Handle view role logic
    console.log("View role:", role);
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const filteredRoles = roles.filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="-ms-4" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    <RiScanLine size={22} aria-hidden="true" />
                    <span className="sr-only">Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Manage Role</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-3 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Manage roles</h1>
              <p className="text-sm text-muted-foreground">
                Manage roles to control access and permissions for different users within the application. You can create, edit, or delete roles as needed.
              </p>
            </div>
            <Button className="px-3">Add Role</Button>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search by role title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoles.map((role) => (
                <div key={role.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{role.role_name}</h3>
                  <div className="flex justify-end mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewRole(role)}>
                          View Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          Edit Permissions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Permissions Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRole?.role_name} Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="read"
                checked={selectedRole?.dashboard || false}
                onCheckedChange={(checked) => {
                  if (selectedRole) {
                    setSelectedRole({ ...selectedRole, dashboard: !!checked });
                  }
                }}
              />
              <label htmlFor="read" className="text-sm">
                Dashboard
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin"
                checked={selectedRole?.contacts || false}
                onCheckedChange={(checked) => {
                  if (selectedRole) {
                    setSelectedRole({ ...selectedRole, contacts: !!checked });
                  }
                }}
              />
              <label htmlFor="admin" className="text-sm">
                Contacts
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin"
                checked={selectedRole?.manage_role || false}
                onCheckedChange={(checked) => {
                  if (selectedRole) {
                    setSelectedRole({ ...selectedRole, manage_role: !!checked });
                  }
                }}
              />
              <label htmlFor="admin" className="text-sm">
                Manage Role
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedRole) {
                  // Save the updated role permissions (e.g., call an API or update state)
                  console.log("Updated role:", selectedRole);
                  setIsDialogOpen(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}