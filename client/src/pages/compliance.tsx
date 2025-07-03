import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Download,
  Upload,
  Search,
  Plus,
  UserCheck,
  Building,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import type { Merchant, ComplianceDocument } from "@shared/schema";

export default function Compliance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<string>("all");
  const [documentType, setDocumentType] = useState<string>("all");
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [selectedMerchantForKyc, setSelectedMerchantForKyc] = useState<Merchant | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: merchants = [], isLoading: merchantsLoading } = useQuery({
    queryKey: ["/api/merchants"],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/compliance/documents"],
  });

  const { data: auditLogs = [], isLoading: auditLogsLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
  });

  const approveKycMutation = useMutation({
    mutationFn: ({ merchantId, status, notes }: { merchantId: number; status: string; notes: string }) => 
      apiRequest("PUT", `/api/merchants/${merchantId}/kyc`, { kycStatus: status, reviewNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchants"] });
      toast({ title: "Success", description: "KYC status updated successfully" });
      setKycDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update KYC status", variant: "destructive" });
    },
  });

  const handleKycReview = (merchant: Merchant) => {
    setSelectedMerchantForKyc(merchant);
    setKycDialogOpen(true);
  };

  const filteredMerchants = merchants.filter((merchant: Merchant) => {
    const matchesSearch = merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const kycStats = {
    pending: merchants.filter((m: Merchant) => m.kycStatus === "pending").length,
    verified: merchants.filter((m: Merchant) => m.kycStatus === "verified").length,
    rejected: merchants.filter((m: Merchant) => m.kycStatus === "rejected").length,
    total: merchants.length,
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (merchantsLoading || documentsLoading || auditLogsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* KYC Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Merchants</p>
                <p className="text-2xl font-bold text-gray-900">{kycStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{kycStats.verified}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{kycStats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{kycStats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="kyc" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kyc">KYC Management</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>KYC Management</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export KYC Report
                  </Button>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search merchants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMerchants.map((merchant: Merchant) => (
                    <TableRow key={merchant.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{merchant.businessName}</p>
                          <p className="text-sm text-gray-500">{merchant.businessType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-900">{merchant.email}</p>
                          <p className="text-xs text-gray-500">{merchant.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getKycStatusColor(merchant.kycStatus)}>
                          {merchant.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskLevelColor(merchant.riskLevel)}>
                          {merchant.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-900">{merchant.businessRegistrationNumber || "N/A"}</p>
                          <p className="text-xs text-gray-500">{formatDate(merchant.createdAt!)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleKycReview(merchant)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Document management system coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Audit log viewer coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Risk assessment tools coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* KYC Review Dialog */}
      <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>KYC Review - {selectedMerchantForKyc?.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <p className="text-sm font-medium">{selectedMerchantForKyc?.businessName}</p>
              </div>
              <div>
                <Label>Business Type</Label>
                <p className="text-sm font-medium">{selectedMerchantForKyc?.businessType}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Registration Number</Label>
                <p className="text-sm font-medium">{selectedMerchantForKyc?.businessRegistrationNumber || "N/A"}</p>
              </div>
              <div>
                <Label>Tax Number</Label>
                <p className="text-sm font-medium">{selectedMerchantForKyc?.taxNumber || "N/A"}</p>
              </div>
            </div>

            <div>
              <Label>Bank Account</Label>
              <p className="text-sm font-medium">{selectedMerchantForKyc?.bankAccount || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kycStatus">KYC Status</Label>
              <Select defaultValue={selectedMerchantForKyc?.kycStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add notes about the KYC review..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setKycDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive">
                Reject
              </Button>
              <Button>
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}