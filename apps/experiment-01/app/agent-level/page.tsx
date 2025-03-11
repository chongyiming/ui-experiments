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
import { Bell, MoreHorizontal } from "lucide-react";
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

// Define the AgentLevel type
interface AgentLevel {
  level_name: string;
  commission_rate: number;
  min_sales_volume: number;
  min_transactions: number;
  downline_commission: number;
}

export default function Page() {
  const [agentLevels, setAgentLevels] = useState<AgentLevel[]>([]);
  const [isAddAgentLevelDialogOpen, setIsAddAgentLevelDialogOpen] =
    useState(false);
  const [isViewAgentLevelDialogOpen, setIsViewAgentLevelDialogOpen] =
    useState(false);
  const [isEditAgentLevelDialogOpen, setIsEditAgentLevelDialogOpen] =
    useState(false);
  const [selectedAgentLevel, setSelectedAgentLevel] =
    useState<AgentLevel | null>(null);
  const [newAgentLevel, setNewAgentLevel] = useState<Partial<AgentLevel>>({
    level_name: "",
    commission_rate: 0,
    min_sales_volume: 0,
    min_transactions: 0,
    downline_commission: 0,
  });

  useEffect(() => {
    const fetchAgentLevels = async () => {
      const { data, error } = await supabase.from("AgentLevel").select("*");

      if (error) {
        console.error("Error fetching agent levels:", error);
      } else {
        setAgentLevels(data as AgentLevel[]);
      }
    };

    fetchAgentLevels();
  }, []);

  const handleAddAgentLevel = () => {
    setIsAddAgentLevelDialogOpen(true);
  };

  const handleViewAgentLevel = (level: AgentLevel) => {
    setSelectedAgentLevel(level);
    setIsViewAgentLevelDialogOpen(true);
  };

  const handleEditAgentLevel = (level: AgentLevel) => {
    setSelectedAgentLevel(level);
    setNewAgentLevel({
      level_name: level.level_name,
      commission_rate: level.commission_rate,
      min_sales_volume: level.min_sales_volume,
      min_transactions: level.min_transactions,
      downline_commission: level.downline_commission,
    });
    setIsEditAgentLevelDialogOpen(true);
  };

  const handleSaveNewAgentLevel = async () => {
    // Validate required fields
    if (
      !newAgentLevel.level_name ||
      !newAgentLevel.commission_rate ||
      !newAgentLevel.min_sales_volume ||
      !newAgentLevel.min_transactions ||
      !newAgentLevel.downline_commission
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    // Save the new agent level to Supabase
    const { data, error } = await supabase
      .from("AgentLevel")
      .insert([newAgentLevel])
      .select();

    if (error) {
      console.error("Error adding agent level:", error);
    } else {
      console.log("Agent level added successfully:", data);
      setIsAddAgentLevelDialogOpen(false);
      setNewAgentLevel({
        level_name: "",
        commission_rate: 0,
        min_sales_volume: 0,
        min_transactions: 0,
        downline_commission: 0,
      });

      // Refresh the agent levels list
      const { data: refreshedData, error: refreshError } = await supabase
        .from("AgentLevel")
        .select("*");

      if (!refreshError) {
        setAgentLevels(refreshedData as AgentLevel[]);
      }
    }
  };

  const handleUpdateAgentLevel = async () => {
    if (!selectedAgentLevel) return;

    // Validate required fields
    if (
      !newAgentLevel.level_name ||
      !newAgentLevel.commission_rate ||
      !newAgentLevel.min_sales_volume ||
      !newAgentLevel.min_transactions ||
      !newAgentLevel.downline_commission
    ) {
      alert("Please fill in all required fields!");
      return;
    }
    newAgentLevel.downline_commission = newAgentLevel.downline_commission / 100;
    newAgentLevel.commission_rate = newAgentLevel.commission_rate / 100;
    // Update the agent level in Supabase
    const { data, error } = await supabase
      .from("AgentLevel")
      .update(newAgentLevel)
      .eq("level_name", selectedAgentLevel.level_name)
      .select();

    if (error) {
      console.error("Error updating agent level:", error);
    } else {
      console.log("Agent level updated successfully:", data);
      setIsEditAgentLevelDialogOpen(false);

      // Update local state
      const updatedAgentLevels = agentLevels.map((level) =>
        level.level_name === selectedAgentLevel.level_name
          ? { ...level, ...newAgentLevel }
          : level
      );
      setAgentLevels(updatedAgentLevels);

      // Reset selected agent level and form
      setSelectedAgentLevel(null);
      setNewAgentLevel({
        level_name: "",
        commission_rate: 0,
        min_sales_volume: 0,
        min_transactions: 0,
        downline_commission: 0,
      });
    }
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
                  <BreadcrumbPage>Agent Level</BreadcrumbPage>
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
              <h1 className="text-2xl font-semibold">Agent Levels</h1>
            </div>
            <Button className="px-3" onClick={handleAddAgentLevel}>
              Add Agent Level
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {/* Agent Level listing */}
            {agentLevels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentLevels.map((level) => (
                  <div key={level.level_name} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{level.level_name}</h3>
                    <br></br>
                    <p>Commission Rate: {level.commission_rate}%</p>
                    <p>Min Sales Volume: {level.min_sales_volume}</p>
                    <p>Min Transactions: {level.min_transactions}</p>
                    <div className="flex justify-end mt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleViewAgentLevel(level)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditAgentLevel(level)}
                          >
                            Edit Level
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No agent levels found</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Add Agent Level Dialog */}
      <Dialog
        open={isAddAgentLevelDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewAgentLevel({
              level_name: "",
              commission_rate: 0,
              min_sales_volume: 0,
              min_transactions: 0,
              downline_commission: 0,
            });
          }
          setIsAddAgentLevelDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agent Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="level_name" className="text-sm font-medium">
                Level Name
              </label>
              <Input
                id="level_name"
                placeholder="Enter level name"
                value={newAgentLevel.level_name}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    level_name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="commission_rate" className="text-sm font-medium">
                Commission Rate (% paid to agent)
              </label>
              <Input
                id="commission_rate"
                placeholder="Enter commission rate"
                type="number"
                value={newAgentLevel.commission_rate}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    commission_rate: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="min_sales_volume" className="text-sm font-medium">
                Min Sales Volume
              </label>
              <Input
                id="min_sales_volume"
                placeholder="Enter min sales volume"
                type="number"
                value={newAgentLevel.min_sales_volume}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    min_sales_volume: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="min_transactions" className="text-sm font-medium">
                Min Transactions
              </label>
              <Input
                id="min_transactions"
                placeholder="Enter min transactions"
                type="number"
                value={newAgentLevel.min_transactions}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    min_transactions: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="downline_commission"
                className="text-sm font-medium"
              >
                Downline Commission (% paid to agent)
              </label>
              <Input
                id="downline_commission"
                placeholder="Enter downline connections"
                type="number"
                value={newAgentLevel.downline_commission}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    downline_commission: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSaveNewAgentLevel}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Agent Level Dialog */}
      <Dialog
        open={isViewAgentLevelDialogOpen}
        onOpenChange={setIsViewAgentLevelDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Level Details</DialogTitle>
          </DialogHeader>
          {selectedAgentLevel && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Level Name</p>
                  <p className="font-medium">{selectedAgentLevel.level_name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Commission Rate</p>
                  <p className="font-medium">
                    {selectedAgentLevel.commission_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Min Sales Volume</p>
                  <p className="font-medium">
                    {selectedAgentLevel.min_sales_volume}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Min Transactions</p>
                  <p className="font-medium">
                    {selectedAgentLevel.min_transactions}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Downline Connections</p>
                  <p className="font-medium">
                    {selectedAgentLevel.downline_commission}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsViewAgentLevelDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Level Dialog */}
      <Dialog
        open={isEditAgentLevelDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewAgentLevel({
              level_name: "",
              commission_rate: 0,
              min_sales_volume: 0,
              min_transactions: 0,
              downline_commission: 0,
            });
          }
          setIsEditAgentLevelDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-level_name" className="text-sm font-medium">
                Level Name
              </label>
              <Input
                id="edit-level_name"
                placeholder="Enter level name"
                value={newAgentLevel.level_name}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    level_name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-commission_rate"
                className="text-sm font-medium"
              >
                Commission Rate (% paid to agent)
              </label>
              <Input
                id="edit-commission_rate"
                placeholder="Enter commission rate"
                type="number"
                value={newAgentLevel.commission_rate}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    commission_rate: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-min_sales_volume"
                className="text-sm font-medium"
              >
                Min Sales Volume
              </label>
              <Input
                id="edit-min_sales_volume"
                placeholder="Enter min sales volume"
                type="number"
                value={newAgentLevel.min_sales_volume}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    min_sales_volume: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-min_transactions"
                className="text-sm font-medium"
              >
                Min Transactions
              </label>
              <Input
                id="edit-min_transactions"
                placeholder="Enter min transactions"
                type="number"
                value={newAgentLevel.min_transactions}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    min_transactions: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-downline_commission"
                className="text-sm font-medium"
              >
                Downline Commission (% paid to agent)
              </label>
              <Input
                id="edit-downline_commission"
                placeholder="Enter downline connections"
                type="number"
                value={newAgentLevel.downline_commission}
                onChange={(e) =>
                  setNewAgentLevel({
                    ...newAgentLevel,
                    downline_commission: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleUpdateAgentLevel}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
