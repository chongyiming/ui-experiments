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
import {
  Building,
  DollarSign,
  FileText,
  ChartBar,
  Bell,
  X,
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
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

// Define the Property type
interface Property {
  id: number;
  project_name: string;
  city: string;
  state: string;
  developer: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  listing_price: number;
  status: boolean;
  commission_rate: number;
}

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // "active" or "inactive"
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
  const [isViewPropertyDialogOpen, setIsViewPropertyDialogOpen] =
    useState(false);
  const [isEditPropertyDialogOpen, setIsEditPropertyDialogOpen] =
    useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    project_name: "",
    city: "",
    state: "",
    developer: "",
    property_type: "",
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    listing_price: 0,
    status: true,
    commission_rate: 0,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      const status = statusFilter === "active"; // Convert to boolean
      let query = supabase.from("Properties").select("*");

      // Filter by status
      query = query.eq("status", status);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data as Property[]);
      }
    };

    fetchProperties();
  }, [statusFilter]); // Add statusFilter as a dependency

  const handleAddProperty = () => {
    setIsAddPropertyDialogOpen(true);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsViewPropertyDialogOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setNewProperty({
      project_name: property.project_name,
      city: property.city,
      state: property.state,
      developer: property.developer,
      property_type: property.property_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.square_feet,
      listing_price: property.listing_price,
      status: property.status,
      commission_rate: property.commission_rate,
    });
    setIsEditPropertyDialogOpen(true);
  };

  const handleSaveNewProperty = async () => {
    // Validate required fields
    if (
      !newProperty.project_name ||
      !newProperty.city ||
      !newProperty.state ||
      !newProperty.developer ||
      !newProperty.property_type ||
      !newProperty.listing_price ||
      !newProperty.commission_rate
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    // Save the new property to Supabase
    const { data, error } = await supabase
      .from("Properties")
      .insert([newProperty])
      .select();

    if (error) {
      console.error("Error adding property:", error);
    } else {
      console.log("Property added successfully:", data);
      setIsAddPropertyDialogOpen(false);
      setNewProperty({
        project_name: "",
        city: "",
        state: "",
        developer: "",
        property_type: "",
        bedrooms: 0,
        bathrooms: 0,
        square_feet: 0,
        listing_price: 0,
        status: true,
        commission_rate: 0,
      });

      // Refresh the properties list
      const status = statusFilter === "active";
      const { data: refreshedData, error: refreshError } = await supabase
        .from("Properties")
        .select("*")
        .eq("status", status);

      if (!refreshError) {
        setProperties(refreshedData as Property[]);
      }
    }
  };

  const handleUpdateProperty = async () => {
    if (!selectedProperty) return;

    // Validate required fields
    if (
      !newProperty.city ||
      !newProperty.state ||
      !newProperty.developer ||
      !newProperty.property_type
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    // Update the property in Supabase
    const { data, error } = await supabase
      .from("Properties")
      .update(newProperty)
      .eq("id", selectedProperty.id)
      .select();

    if (error) {
      console.error("Error updating property:", error);
    } else {
      console.log("Property updated successfully:", data);
      setIsEditPropertyDialogOpen(false);

      // Update local state if the status matches our current filter
      if (newProperty.status === (statusFilter === "active")) {
        const updatedProperties = properties.map((property) =>
          property.id === selectedProperty.id
            ? { ...property, ...newProperty }
            : property
        );
        setProperties(updatedProperties);
      } else {
        // If status changed, refresh the property list based on current filter
        const status = statusFilter === "active";
        const { data: refreshedData, error: refreshError } = await supabase
          .from("Properties")
          .select("*")
          .eq("status", status);

        if (!refreshError) {
          setProperties(refreshedData as Property[]);
        }
      }

      // Reset selected property and form
      setSelectedProperty(null);
      setNewProperty({
        project_name: "",
        city: "",
        state: "",
        developer: "",
        property_type: "",
        bedrooms: 0,
        bathrooms: 0,
        square_feet: 0,
        listing_price: 0,
        status: true,
        commission_rate: 0,
      });
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCount = {
    active: 0,
    inactive: 0,
  };

  // Count properties by status (for showing count on tabs)
  const getStatusCounts = async () => {
    const { data: activeData, error: activeError } = await supabase
      .from("Properties")
      .select("id", { count: "exact" })
      .eq("status", true);

    const { data: inactiveData, error: inactiveError } = await supabase
      .from("Properties")
      .select("id", { count: "exact" })
      .eq("status", false);

    if (!activeError && !inactiveError) {
      statusCount.active = activeData?.length || 0;
      statusCount.inactive = inactiveData?.length || 0;
    }
  };

  // Call this on component mount
  useEffect(() => {
    getStatusCounts();
  }, []);
  const resetNewProperty = () => {
    setNewProperty({
      project_name: "",
      city: "",
      state: "",
      developer: "",
      property_type: "",
      bedrooms: 0,
      bathrooms: 0,
      square_feet: 0,
      listing_price: 0,
      status: true,
      commission_rate: 0,
    });
  };
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
                  <BreadcrumbPage>Properties</BreadcrumbPage>
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
              <h1 className="text-2xl font-semibold">Properties</h1>
            </div>
            <Button className="px-3" onClick={handleAddProperty}>
              Add Properties
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search Properties
              </label>
              <Input
                id="search"
                placeholder="Search by project_name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2"
              />
            </div>

            {/* Status filter tabs */}
            <div className="flex border rounded-md w-fit">
              <Button
                variant={statusFilter === "active" ? "default" : "ghost"}
                className="rounded-r-none"
                onClick={() => setStatusFilter("active")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "ghost"}
                className="rounded-l-none"
                onClick={() => setStatusFilter("inactive")}
              >
                <X className="mr-2 h-4 w-4" />
                Inactive
              </Button>
            </div>

            {/* Properties listing header */}
            <div className="flex items-center justify-between py-2 border-b">
              <h2 className="text-lg font-medium">
                {statusFilter === "active"
                  ? "Active Properties"
                  : "Inactive Properties"}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredProperties.length} properties found
              </p>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{property.project_name}</h3>
                    <p>
                      {property.city}, {property.state}
                    </p>
                    <p className="mt-2 text-sm">
                      RM {property.listing_price.toLocaleString()}
                    </p>
                    <div className="flex justify-end mt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleViewProperty(property)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProperty(property)}
                          >
                            Edit Property
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No {statusFilter} properties found
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Add Property Dialog */}
      <Dialog
        open={isAddPropertyDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetNewProperty(); // Reset newProperty when the dialog is closed
          }
          setIsAddPropertyDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project_name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project_name"
                placeholder="Enter project_name"
                value={newProperty.project_name}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    project_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <Input
                id="city"
                placeholder="Enter city"
                value={newProperty.city}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, city: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <Input
                id="state"
                placeholder="Enter state"
                value={newProperty.state}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, state: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="developer" className="text-sm font-medium">
                Developer
              </label>
              <Input
                id="developer"
                placeholder="Enter developer"
                value={newProperty.developer}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, developer: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="property_type" className="text-sm font-medium">
                Property Type
              </label>
              <Input
                id="property_type"
                placeholder="Enter property type"
                value={newProperty.property_type}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    property_type: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bedrooms" className="text-sm font-medium">
                Bedrooms
              </label>
              <Input
                id="bedrooms"
                placeholder="Number of bedrooms"
                type="number"
                value={newProperty.bedrooms}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    bedrooms: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bathrooms" className="text-sm font-medium">
                Bathrooms
              </label>
              <Input
                id="bathrooms"
                placeholder="Number of bathrooms"
                type="number"
                value={newProperty.bathrooms}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    bathrooms: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="square_feet" className="text-sm font-medium">
                Square Feet
              </label>
              <Input
                id="square_feet"
                placeholder="Square footage"
                type="number"
                value={newProperty.square_feet}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    square_feet: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="listing_price" className="text-sm font-medium">
                Listing Price (RM)
              </label>
              <Input
                id="listing_price"
                placeholder="Enter listing price"
                type="number"
                value={newProperty.listing_price}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    listing_price: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={newProperty.status || false}
                  onCheckedChange={(checked) =>
                    setNewProperty({ ...newProperty, status: !!checked })
                  }
                />
                <label htmlFor="status" className="text-sm font-medium">
                  Status (Active)
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="commission_rate" className="text-sm font-medium">
                Commission Rate (%)
              </label>
              <Input
                id="commission_rate"
                placeholder="Enter commission rate"
                type="number"
                value={newProperty.commission_rate}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    commission_rate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {/* <Button
              variant="outline"
              onClick={() => setIsAddPropertyDialogOpen(false)}
            >
              Cancel
            </Button> */}
            <Button onClick={handleSaveNewProperty}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Property Dialog */}
      <Dialog
        open={isViewPropertyDialogOpen}
        onOpenChange={setIsViewPropertyDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Project Name</p>
                  <p className="font-medium">{selectedProperty.project_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {selectedProperty.city}, {selectedProperty.state}{" "}
                    {selectedProperty.developer}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-medium">
                    {selectedProperty.property_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {selectedProperty.status ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium">{selectedProperty.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium">{selectedProperty.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Square Feet</p>
                  <p className="font-medium">{selectedProperty.square_feet}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Listing Price</p>
                  <p className="font-medium">
                    RM {selectedProperty.listing_price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commission Rate</p>
                  <p className="font-medium">
                    {selectedProperty.commission_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Potential Commission</p>
                  <p className="font-medium">
                    RM{" "}
                    {(
                      (selectedProperty.listing_price *
                        selectedProperty.commission_rate) /
                      100
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsViewPropertyDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog
        open={isEditPropertyDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetNewProperty(); // Reset newProperty when the dialog is closed
          }
          setIsEditPropertyDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-project-name"
                className="text-sm font-medium"
              >
                Project Name
              </label>
              <Input
                id="edit-project-name"
                placeholder="Enter Project Name"
                value={newProperty.project_name}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    project_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-city" className="text-sm font-medium">
                City
              </label>
              <Input
                id="edit-city"
                placeholder="Enter city"
                value={newProperty.city}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, city: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-state" className="text-sm font-medium">
                State
              </label>
              <Input
                id="edit-state"
                placeholder="Enter state"
                value={newProperty.state}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, state: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-developer" className="text-sm font-medium">
                Developer
              </label>
              <Input
                id="edit-developer"
                placeholder="Enter developer"
                value={newProperty.developer}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, developer: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-property_type"
                className="text-sm font-medium"
              >
                Property Type
              </label>
              <Input
                id="edit-property_type"
                placeholder="Enter property type"
                value={newProperty.property_type}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    property_type: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-bedrooms" className="text-sm font-medium">
                Bedrooms
              </label>
              <Input
                id="edit-bedrooms"
                placeholder="Number of bedrooms"
                type="number"
                value={newProperty.bedrooms}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    bedrooms: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-bathrooms" className="text-sm font-medium">
                Bathrooms
              </label>
              <Input
                id="edit-bathrooms"
                placeholder="Number of bathrooms"
                type="number"
                value={newProperty.bathrooms}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    bathrooms: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-square_feet" className="text-sm font-medium">
                Square Feet
              </label>
              <Input
                id="edit-square_feet"
                placeholder="Square footage"
                type="number"
                value={newProperty.square_feet}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    square_feet: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-listing_price"
                className="text-sm font-medium"
              >
                Listing Price (RM)
              </label>
              <Input
                id="edit-listing_price"
                placeholder="Enter listing price"
                type="number"
                value={newProperty.listing_price}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    listing_price: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-status"
                  checked={newProperty.status || false}
                  onCheckedChange={(checked) =>
                    setNewProperty({ ...newProperty, status: !!checked })
                  }
                />
                <label htmlFor="edit-status" className="text-sm font-medium">
                  Status (Active)
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-commission_rate"
                className="text-sm font-medium"
              >
                Commission Rate (%)
              </label>
              <Input
                id="edit-commission_rate"
                placeholder="Enter commission rate"
                type="number"
                value={newProperty.commission_rate}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    commission_rate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {/* <Button
              variant="outline"
              onClick={() => setIsEditPropertyDialogOpen(false)}
            >
              Cancel
            </Button> */}
            <Button onClick={handleUpdateProperty}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
