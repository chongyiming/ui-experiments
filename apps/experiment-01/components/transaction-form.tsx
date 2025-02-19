import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TransactionFormProps {
  onClose: () => void;
  marketType: "primary" | "secondary";
}

const TransactionForm = ({ onClose, marketType }: TransactionFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "loan">("cash");
  const [buyerType, setBuyerType] = useState<"individual" | "company">(
    "individual"
  );
  const [formData, setFormData] = useState({
    listingPrice: "",
    transactionPrice: "",
    nettPrice: "",
    commissionRate: "",
    commissionAmount: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    validatePrices();
    calculateCommission();
  }, [formData]);

  const validatePrices = () => {
    const newErrors: Record<string, string> = {};

    const transactionPrice = Number(formData.transactionPrice) || 0;
    const nettPrice = Number(formData.nettPrice) || 0;
    const commissionRate = Number(formData.commissionRate) || 0;

    // Basic validation
    if (transactionPrice <= 0 && formData.transactionPrice !== "") {
      newErrors.transactionPrice = "Transaction price must be greater than 0";
    }

    if (nettPrice > transactionPrice && formData.nettPrice !== "") {
      newErrors.nettPrice = "Nett price cannot exceed transaction price";
    }

    if (
      commissionRate > 100 ||
      (commissionRate <= 0 && formData.commissionRate !== "")
    ) {
      newErrors.commissionRate = "Commission rate must be between 0 and 100%";
    }

    setErrors(newErrors);
  };

  const calculateCommission = () => {
    const nettPrice = Number(formData.nettPrice) || 0;
    const commissionRate = Number(formData.commissionRate) || 0;

    if (nettPrice > 0 && commissionRate > 0) {
      const commission = (nettPrice * commissionRate) / 100;
      setFormData((prev) => ({
        ...prev,
        commissionAmount: commission.toString(),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      // TODO: Submit form
      onClose();
    }
  };

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
                      />
                      {/* TODO: Implement project search results dropdown */}
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

              <div className="space-y-2">
                <Label htmlFor="propertyCategory">Property Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertySubType">Property Sub-Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="terrace">Terrace</SelectItem>
                    <SelectItem value="semi-d">Semi-D</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listingPrice">Listing Price</Label>
                <Input
                  id="listingPrice"
                  type="number"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionPrice">Transaction Price</Label>
                <Input
                  id="transactionPrice"
                  type="number"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nettPrice">Nett Price</Label>
                <Input
                  id="nettPrice"
                  type="number"
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  placeholder="Enter percentage"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionSplit">Commission Split (%)</Label>
                <Input
                  id="commissionSplit"
                  type="number"
                  step="0.1"
                  placeholder="If co-broke"
                />
              </div>
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

            {paymentMethod === "loan" && (
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
            )}
          </div>

          {/* Buyer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Buyer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name</Label>
                <Input
                  id="buyerName"
                  placeholder="Enter buyer's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerType">Buyer Type</Label>
                <RadioGroup
                  value={buyerType}
                  onValueChange={(value: "individual" | "company") =>
                    setBuyerType(value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual">Individual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company">Company</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Email (Optional)</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  placeholder="Enter buyer's email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Phone (Optional)</Label>
                <Input id="buyerPhone" placeholder="Enter buyer's phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSource">Source of Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="portal">Portal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyingPurpose">Buying Purpose</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ownStay">Own Stay</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
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
                    id="coAgentDetails"
                    placeholder="Enter co-agent details if any"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRemarks">Special Remarks</Label>
                  <Textarea
                    id="specialRemarks"
                    placeholder="Enter any special remarks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpTasks">Follow-up Tasks</Label>
                  <Textarea
                    id="followUpTasks"
                    placeholder="Enter follow-up tasks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleConditions">
                    Special Conditions of Sale
                  </Label>
                  <Textarea
                    id="saleConditions"
                    placeholder="Enter special conditions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incentives">Incentives/Rebates</Label>
                  <Textarea
                    id="incentives"
                    placeholder="Enter incentives if any"
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
          <Button type="submit">Create Transaction</Button>
        </div>
      </form>
    </Card>
  );
};

export default TransactionForm;
