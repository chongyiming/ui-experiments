"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import TransactionForm from "@/components/transaction-form";
import TransactionList from "@/components/transaction-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import UserDropdown from "@/components/user-dropdown";
import { RiScanLine } from "@remixicon/react";

const upcomingAppointments = [
  {
    id: 1,
    title: "Property Viewing",
    client: "John Smith",
    property: "123 Main St",
    time: "2:00 PM Today",
  },
  {
    id: 2,
    title: "Contract Signing",
    client: "Sarah Johnson",
    property: "456 Oak Ave",
    time: "10:00 AM Tomorrow",
  },
];

const followUpReminders = [
  { id: 1, client: "Mike Brown", task: "Follow up on offer", dueDate: "Today" },
  {
    id: 2,
    client: "Lisa Davis",
    task: "Send property documents",
    dueDate: "Tomorrow",
  },
];

const recentTasks = [
  {
    id: 1,
    title: "Update listing photos",
    status: "pending",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Client feedback call",
    status: "completed",
    dueDate: "Yesterday",
  },
];

const Dashboard = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showMarketTypeDialog, setShowMarketTypeDialog] = useState(false);
  const [selectedMarketType, setSelectedMarketType] = useState<
    "primary" | "secondary" | null
  >(null);

  const handleNewTransaction = () => {
    setShowMarketTypeDialog(true);
  };

  const handleMarketTypeSelect = (type: "primary" | "secondary") => {
    setSelectedMarketType(type);
    setShowMarketTypeDialog(false);
    setShowTransactionForm(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="border-b">
          {/* Top Row: Breadcrumb and User Dropdown */}
          <div className="flex h-16 shrink-0 items-center gap-2">
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
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
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
          </div>

          {/* Bottom Row: New Transaction Button */}
          <div className="flex items-center justify-between px-3 py-2 border-t">
            <div className="flex-1"></div> {/* Spacer */}
            <Button onClick={handleNewTransaction}>Add Sale</Button>
          </div>
        </header>

        {/* Market Type Selection Dialog */}
        <Dialog
          open={showMarketTypeDialog}
          onOpenChange={setShowMarketTypeDialog}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Select Market Type</DialogTitle>
              <DialogDescription>
                Choose the type of property transaction you want to create
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => handleMarketTypeSelect("primary")}
              >
                <Building className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Primary Market</p>
                  <p className="text-sm text-muted-foreground">
                    Developer Projects
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => handleMarketTypeSelect("secondary")}
              >
                <FileText className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Secondary Market</p>
                  <p className="text-sm text-muted-foreground">
                    Individual Property
                  </p>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          {showTransactionForm ? (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
              <div className="min-h-screen px-4 py-8">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => {
                    setShowTransactionForm(false);
                    setSelectedMarketType(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
                <TransactionForm
                  onClose={() => {
                    setShowTransactionForm(false);
                    setSelectedMarketType(null);
                  }}
                  marketType={selectedMarketType!}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 glass-card animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Listings
                      </p>
                      <h3 className="text-2xl font-semibold mt-2">24</h3>
                      <p className="text-sm text-green-600 mt-1">
                        ↑ 4 from last month
                      </p>
                    </div>
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                </Card>

                <Card className="p-6 glass-card animate-fadeIn animation-delay-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Monthly Commission
                      </p>
                      <h3 className="text-2xl font-semibold mt-2">$45,850</h3>
                      <p className="text-sm text-green-600 mt-1">
                        ↑ 12% from last month
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </Card>

                <Card className="p-6 glass-card animate-fadeIn animation-delay-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Client Base
                      </p>
                      <h3 className="text-2xl font-semibold mt-2">156</h3>
                      <p className="text-sm text-green-600 mt-1">
                        ↑ 8 new this month
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </Card>

                <Card className="p-6 glass-card animate-fadeIn animation-delay-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Conversion Rate
                      </p>
                      <h3 className="text-2xl font-semibold mt-2">68%</h3>
                      <p className="text-sm text-green-600 mt-1">
                        ↑ 5% from last month
                      </p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              </div>

              {/* Appointments and Reminders Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Appointments */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      Upcoming Appointments
                    </h2>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{appointment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.client} - {appointment.property}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {appointment.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Follow-up Reminders */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      Follow-up Reminders
                    </h2>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    {followUpReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{reminder.client}</h3>
                          <p className="text-sm text-muted-foreground">
                            {reminder.task}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {reminder.dueDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Tasks Section */}
              <section className="mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Tasks</h2>
                    <Button variant="outline" size="sm">
                      + Add Task
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className={`h-5 w-5 ${task.status === "completed" ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Due: {task.dueDate}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Mark Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* Transactions Section */}
              <section className="mb-8">
                <TransactionList />
              </section>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
