import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "../app/supabaseClient";
import { useUserPermissions } from "./UserPermissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface TransactionFormProps {
  onClose: () => void;
  marketType: "primary" | "secondary";
}

const TransactionForm = ({ onClose, marketType }: TransactionFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "loan">("cash");
  const [transactionType, setTransactionType] = useState<"sale" | "purchase" | "rental">("sale");

  const [buyerType, setBuyerType] = useState<"individual" | "company">("individual");
  const [formData, setFormData] = useState({
    agent_id: "",
    transactionPrice: "",
    nettPrice: "",
    commissionRate: "",
    commissionAmount: "",
    cobroke_id: "",
    commissionSplit:"",
    cobroke_commission_amount: "",
    co_agent_details:"",
    special_remarks:"",
    follow_up_tasks:"",
    special_conditions_of_sale:"",
    incentives_rebates:""

  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);
  const [agents, setAgents] = useState<{ id: string; username: string }[]>([]);
  const [buyers, setBuyers] = useState<{ id: string; full_name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [agentSearchQuery, setAgentSearchQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAgentDropdownVisible, setIsAgentDropdownVisible] = useState(false);
  const { userId, perms, id } = useUserPermissions();
  const [buyerSearchQuery, setBuyerSearchQuery] = useState("");
  const [isBuyerDropdownVisible, setIsBuyerDropdownVisible] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>("");
  const [isAddBuyerDialogOpen, setIsAddBuyerDialogOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState<{
    full_name: string;
    email: string;
    phone: string;
    referred_by: number;
  }>({
    full_name: "",
    email: "",
    phone: "",
    referred_by: 0, // Temporary default value
  });
  const prevNettPrice = useRef<string>("");
  const prevCommissionRate = useRef<string>("");
  console.log("new",newBuyer)
  console.log("userid",userId)
  console.log("perm",perms)
  console.log("Id",id)
  console.log(formData)
  useEffect(() => {
    if (id) {
      setNewBuyer((prev) => ({
        ...prev,
        referred_by: parseInt(id), // Update `referred_by` when `id` is available
      }));
      setFormData((prev) => ({
        ...prev,
        agent_id: id, // Update `referred_by` when `id` is available
      }));
    }
  }, [id]); // Run this effect whenever `id` changes
  

  useEffect(() => {
    
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("Properties").select("id, address");

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data);
      }
    };

    const fetchAgents = async () => {
      const { data, error } = await supabase.from("Agents").select("id, username");

      if (error) {
        console.error("Error fetching agents:", error);
      } else {
        setAgents(data);
      }
    };

    const fetchBuyers = async () => {
      const { data, error } = await supabase.from("Buyer").select("id, full_name");

      if (error) {
        console.error("Error fetching buyers:", error);
      } else {
        setBuyers(data);
      }
    };

    fetchProperties();
    fetchAgents();
    fetchBuyers()
    

  }, []);

  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAgents = agents.filter((agent) =>
    agent.username.toLowerCase().includes(agentSearchQuery.toLowerCase())
  );

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.full_name.toLowerCase().includes(buyerSearchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };


// const handleAddBuyer = () => {
//   setIsAddBuyerPopupVisible(true);
// };

const handleNewBuyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  setNewBuyer((prev) => ({ ...prev, [id]: value }));
};
const handleNewBuyerSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevent default form submission
  e.stopPropagation(); // Stop event bubbling

  const { data, error } = await supabase.from("Buyer").insert([newBuyer]).select();
  if (error) {
    console.error("Error adding buyer:", error);
  } else {
    setBuyers((prev) => [...prev, data[0]]);
    setIsAddBuyerDialogOpen(false);
    setNewBuyer({
      full_name: "",
      email: "",
      phone: "",
      referred_by: parseInt(id),
    });
  }
};


const validateAndCalculate = () => {
  const newErrors: Record<string, string> = {};

  const transactionPrice = Number(formData.transactionPrice) || 0;
  const nettPrice = Number(formData.nettPrice) || 0;
  const commissionRate = Number(formData.commissionRate) || 0;

  // Validate transaction price
  if (transactionPrice <= 0 && formData.transactionPrice !== "") {
    newErrors.transactionPrice = "Transaction price must be greater than 0";
  }

  // Validate nett price
  if (nettPrice > transactionPrice && formData.nettPrice !== "") {
    newErrors.nettPrice = "Nett price cannot exceed transaction price";
  }

  // Validate commission rate
  if (
    commissionRate > 100 ||
    (commissionRate <= 0 && formData.commissionRate !== "")
  ) {
    newErrors.commissionRate = "Commission rate must be between 0 and 100%";
  }

  setErrors(newErrors);

  // Calculate commission amount
  if (nettPrice > 0 && commissionRate > 0) {
    const commissionAmount = (nettPrice * commissionRate) / 100;
    if (formData.commissionAmount !== commissionAmount.toFixed(2)) {
      setFormData((prev) => ({
        ...prev,
        commissionAmount: commissionAmount.toFixed(2),
      }));
    }
  } else if (formData.commissionAmount !== "") {
    setFormData((prev) => ({
      ...prev,
      commissionAmount: "",
    }));
  }
};

useEffect(() => {
  validateAndCalculate();
}, [formData.transactionPrice, formData.nettPrice, formData.commissionRate]);

useEffect(() => {
  if (
    formData.nettPrice !== prevNettPrice.current ||
    formData.commissionRate !== prevCommissionRate.current
  ) {
    validateAndCalculate();
    prevNettPrice.current = formData.nettPrice;
    prevCommissionRate.current = formData.commissionRate;
  }
}, [formData.nettPrice, formData.commissionRate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate form data
    if (Object.keys(errors).length > 0) {
      console.error("Form contains errors. Please fix them before submitting.");
      return;
    }
  
    // Prepare the data to be inserted into the Transactions table
    const transactionData = {
      agent_id: parseInt(formData.agent_id),
      property_id: parseInt(selectedPropertyId),
      buyer_id: parseInt(selectedBuyerId),
      transaction_price: parseFloat(formData.transactionPrice),
      nett_price: parseFloat(formData.nettPrice),
      commission_rate: parseFloat(formData.commissionRate),
      commission_amount: parseFloat(formData.commissionAmount),
      cobroke_id: parseInt(selectedAgentId),
      cobroke_commission_rate: parseFloat(formData.commissionSplit),
      cobroke_commission_amount: parseFloat(formData.cobroke_commission_amount),
      co_agent_details: formData.co_agent_details,
      special_remarks: formData.special_remarks,
      follow_up_tasks: formData.follow_up_tasks,
      special_conditions_of_sale: formData.special_conditions_of_sale,
      incentives_rebates: parseFloat(formData.incentives_rebates),
      payment_method: paymentMethod,
      transaction_type: transactionType
    };
    console.log(transactionData)
    try {
      // Insert the data into the Transactions table
      const { data, error } = await supabase
        .from("Transactions")
        .insert([transactionData])
        // .select();
  
      if (error) {
        console.error("Error inserting transaction:", error);
        alert("Failed to create transaction. Please try again.");
      } else {
        console.log("Transaction created successfully:", data);
        alert("Transaction created successfully!");
        onClose(); // Close the form after successful submission
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const nettPrice = Number(formData.nettPrice) || 0;
    const commissionRate = Number(formData.commissionRate) || 0;

    if (nettPrice > 0 && commissionRate > 0) {
      const commissionAmount = (nettPrice * commissionRate) / 100;
      setFormData((prev) => ({
        ...prev,
        commissionAmount: commissionAmount.toFixed(2), // Round to 2 decimal places
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        commissionAmount: "", // Clear if inputs are invalid
      }));
    }
  }, [formData.nettPrice, formData.commissionRate]);

  useEffect(() => {
    const commissionAmount = parseFloat(formData.commissionAmount) || 0;
    const commissionSplit = parseFloat(formData.commissionSplit) || 0;
  
    if (commissionAmount > 0 && commissionSplit > 0) {
      const cobrokeCommissionAmount = (commissionAmount * commissionSplit) / 100;
      setFormData((prev) => ({
        ...prev,
        cobroke_commission_amount: cobrokeCommissionAmount.toFixed(2), // Round to 2 decimal places
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        cobroke_commission_amount: "", // Clear if inputs are invalid
      }));
    }
  }, [formData.commissionAmount, formData.commissionSplit]);
  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            New{" "}
            {marketType === "primary"
              ? "Developer Project"
              : "Individual Property"}{" "}
            Transaction
          </h2>

          {/* Basic Project Details */}
          <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketType === "primary" ? (
              <>
                {/* Primary Market Fields */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="projectSearch">Search Project</Label>
                  <div className="relative">
                    <Input
                      id="projectSearch"
                      placeholder="Type to search developer projects..."
                      className="w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsDropdownVisible(true)}
                      onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
                      required // Make this field mandatory
                    />
                    {/* Dropdown for search results */}
                    {isDropdownVisible && (
                      <div className="absolute z-10 mt-2 w-full bg-background border border-muted rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredProperties.length > 0 ? (
                          filteredProperties.slice(0, 5).map((property) => (
                            <div
                              key={property.id}
                              className="p-2 hover:bg-muted cursor-pointer"
                              onClick={() => {
                                setSelectedPropertyId(property.id);
                                setSearchQuery(property.address);
                                setIsDropdownVisible(false);
                              }}
                            >
                              {property.address}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            No Properties Found
                          </div>
                        )}
                        {filteredProperties.length > 5 && (
                          <div className="p-2 text-sm text-muted-foreground">
                            {filteredProperties.length - 5} more properties...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Search for developer projects by name, location, or
                    developer
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Secondary Market Fields */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Textarea
                    id="propertyAddress"
                    placeholder="Enter complete property address"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Transaction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <RadioGroup
                value={transactionType}
                onValueChange={(value: "sale" | "purchase" | "rental") =>
                  setTransactionType(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sale" id="sale" />
                  <Label htmlFor="sale">Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purchase" id="purchase" />
                  <Label htmlFor="purchase">Purchase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental">Rental</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionPrice">Transaction Price</Label>
              <Input
                id="transactionPrice"
                type="number"
                placeholder="Enter amount"
                value={formData.transactionPrice}
                onChange={handleInputChange}
                required // Make this field mandatory
              />
              {errors.transactionPrice && (
                <p className="text-sm text-red-500">{errors.transactionPrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nettPrice">Nett Price</Label>
              <Input
                id="nettPrice"
                type="number"
                placeholder="Enter amount"
                value={formData.nettPrice}
                onChange={handleInputChange}
                required // Make this field mandatory
              />
              {errors.nettPrice && (
                <p className="text-sm text-red-500">{errors.nettPrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.1"
                placeholder="Enter percentage"
                value={formData.commissionRate}
                onChange={handleInputChange}
                required // Make this field mandatory
              />
              {errors.commissionRate && (
                <p className="text-sm text-red-500">{errors.commissionRate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionAmount">Commission Amount</Label>
              <Input
                id="commissionAmount"
                type="number"
                placeholder="Calculated automatically"
                value={formData.commissionAmount}
                readOnly // Make this field read-only
              />
            </div>

            {/* Select Agent */}
            <div className="space-y-2">
  <Label htmlFor="agentSearch">Select Agent</Label>
  <div className="relative">
    <Input
      id="agentSearch"
      placeholder="Type to search agents..."
      className="w-full"
      value={agentSearchQuery}
      onChange={(e) => setAgentSearchQuery(e.target.value)}
      onFocus={() => setIsAgentDropdownVisible(true)}
      onBlur={() => setTimeout(() => setIsAgentDropdownVisible(false), 100)}
    />
    {isAgentDropdownVisible && (
      <div className="absolute z-10 mt-2 w-full bg-background border border-muted rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-2 hover:bg-muted cursor-pointer"
              onClick={() => {
                setSelectedAgentId(agent.id);
                setAgentSearchQuery(agent.username);
                setIsAgentDropdownVisible(false);
              }}
            >
              {agent.username}
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-muted-foreground">
            No Agents Found
          </div>
        )}
      </div>
    )}
  </div>
</div>

            {/* Commission Split */}
            <div className="space-y-2">
              <Label htmlFor="commissionSplit">Commission Split (%)</Label>
              <Input
                id="commissionSplit"
                type="number"
                step="0.1"
                placeholder="Enter commission split"
                value={formData.commissionSplit}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
  <Label htmlFor="cobroke_commission_amount">Co-Broke Commission Amount</Label>
  <Input
    id="cobroke_commission_amount"
    type="number"
    placeholder="Calculated automatically"
    value={formData.cobroke_commission_amount}
    readOnly // Make this field read-only
  />
</div>
            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "cash" | "loan") =>
                  setPaymentMethod(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loan" id="loan" />
                  <Label htmlFor="loan">Loan</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Loan Details (Conditional) */}
          {/* {paymentMethod === "loan" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="Enter bank name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="Enter loan amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanStatus">Loan Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )} */}
        </div>

        {/* Buyer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buyer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
  <Label htmlFor="buyerSearch">Select Buyer</Label>
  <div className="relative">
    <Input
      id="buyerSearch"
      placeholder="Type to search buyers..."
      className="w-full"
      value={buyerSearchQuery}
      onChange={(e) => setBuyerSearchQuery(e.target.value)}
      onFocus={() => setIsBuyerDropdownVisible(true)}
      onBlur={() => setTimeout(() => setIsBuyerDropdownVisible(false), 100)}
      required
    />
    {isBuyerDropdownVisible && (
      <div className="absolute z-10 mt-2 w-full bg-background border border-muted rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {filteredBuyers.length > 0 ? (
          filteredBuyers.map((buyer) => (
            <div
              key={buyer.id}
              className="p-2 hover:bg-muted cursor-pointer"
              onClick={() => {
                setSelectedBuyerId(buyer.id);
                setBuyerSearchQuery(buyer.full_name);
                setIsBuyerDropdownVisible(false);
              }}
            >
              {buyer.full_name}
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-muted-foreground">
            No Buyers Found
          </div>
        )}
      </div>
    )}
  </div>
</div>
            <div className="flex items-end">
            <Dialog open={isAddBuyerDialogOpen} onOpenChange={setIsAddBuyerDialogOpen}>
  <DialogTrigger asChild>
    <Button type="button" variant="outline" className="w-32">
      Add New Buyer
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Buyer</DialogTitle>
    </DialogHeader>
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling
        handleNewBuyerSubmit(e);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          placeholder="Enter full name"
          value={newBuyer.full_name}
          onChange={handleNewBuyerChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email"
          value={newBuyer.email}
          onChange={handleNewBuyerChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="Enter phone number"
          value={newBuyer.phone}
          onChange={handleNewBuyerChange}
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAddBuyerDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit">Save Buyer</Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
            </div>
          </div>
        </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documents</h3>
            <div className="border-2 border-dashed border-muted p-6 rounded-lg text-center">
              <input
                type="file"
                id="documents"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="documents"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FileUp className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Upload required documents (Booking Form, ID Copy, etc.)
                </span>
              </label>
              {files.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  {files.length} file(s) selected
                </div>
              )}
            </div>
          </div>

          {/* Show More Details Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdditionalFields(!showAdditionalFields)}
          >
            {showAdditionalFields
              ? "Hide Additional Details"
              : "Show Additional Details"}
          </Button>

          {/* Additional Details (Optional) */}
          {showAdditionalFields && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coAgentDetails">Co-Agent Details</Label>
                  <Textarea
  id="co_agent_details"
  placeholder="Enter co-agent details if any"
  value={formData.co_agent_details}
  onChange={handleInputChange}
/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRemarks">Special Remarks</Label>
                  <Textarea
  id="special_remarks"
  placeholder="Enter any special remarks"
  value={formData.special_remarks}
  onChange={handleInputChange}
/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpTasks">Follow-up Tasks</Label>
                  <Textarea
  id="follow_up_tasks"
  placeholder="Enter follow-up tasks"
  value={formData.follow_up_tasks}
  onChange={handleInputChange}
/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleConditions">
                    Special Conditions of Sale
                  </Label>
                  <Textarea
  id="special_conditions_of_sale"
  placeholder="Enter special conditions"
  value={formData.special_conditions_of_sale}
  onChange={handleInputChange}
/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incentives">Incentives/Rebates</Label>
                  <Textarea
  id="incentives_rebates"
  placeholder="Enter incentives if any"
  value={formData.incentives_rebates}
  onChange={handleInputChange}
/>
                  
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" >Create Transaction</Button>
        </div>
      </form>
    </Card>
  );
};

export default TransactionForm;