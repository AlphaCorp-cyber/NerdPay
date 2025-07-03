import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Merchant, Transaction, SettlementReport } from "@shared/schema";

export default function Settlement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: merchants = [], isLoading: merchantsLoading } = useQuery({
    queryKey: ["/api/merchants"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: settlementReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/settlement/reports"],
  });

  const generateReportMutation = useMutation({
    mutationFn: (data: { merchantId?: number; dateFrom: string; dateTo: string }) => 
      apiRequest("POST", "/api/settlement/generate", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settlement/reports"] });
      toast({ title: "Success", description: "Settlement report generated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate settlement report", variant: "destructive" });
    },
  });

  const processSettlementMutation = useMutation({
    mutationFn: (reportId: number) => 
      apiRequest("POST", `/api/settlement/process/${reportId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settlement/reports"] });
      toast({ title: "Success", description: "Settlement processed successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to process settlement", variant: "destructive" });
    },
  });

  // Calculate settlement statistics
  const settlementStats = {
    totalPending: settlementReports
      .filter((r: SettlementReport) => r.status === "pending")
      .reduce((sum: number, r: SettlementReport) => sum + parseFloat(r.netAmount), 0),
    totalProcessed: settlementReports
      .filter((r: SettlementReport) => r.status === "processed")
      .reduce((sum: number, r: SettlementReport) => sum + parseFloat(r.netAmount), 0),
    pendingCount: settlementReports.filter((r: SettlementReport) => r.status === "pending").length,
    processedCount: settlementReports.filter((r: SettlementReport) => r.status === "processed").length,
  };

  // Calculate today's transactions for settlement
  const today = new Date();
  const todayTransactions = transactions.filter((t: Transaction) => {
    const txDate = new Date(t.createdAt!);
    return txDate.toDateString() === today.toDateString() && t.status === "success";
  });

  const todayStats = {
    totalTransactions: todayTransactions.length,
    totalVolume: todayTransactions.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0),
    totalFees: todayTransactions.reduce((sum: number, t: Transaction) => sum + parseFloat(t.fees || "0"), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMerchantName = (merchantId: number) => {
    const merchant = merchants.find((m: Merchant) => m.id === merchantId);
    return merchant?.businessName || "Unknown";
  };

  const filteredReports = settlementReports.filter((report: SettlementReport) => {
    const matchesSearch = getMerchantName(report.merchantId!).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMerchant = selectedMerchant === "all" || report.merchantId!.toString() === selectedMerchant;
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus;
    return matchesSearch && matchesMerchant && matchesStatus;
  });

  const handleGenerateReport = () => {
    if (!dateRange.from || !dateRange.to) {
      toast({ 
        title: "Error", 
        description: "Please select a date range", 
        variant: "destructive" 
      });
      return;
    }

    generateReportMutation.mutate({
      merchantId: selectedMerchant === "all" ? undefined : parseInt(selectedMerchant),
      dateFrom: format(dateRange.from, "yyyy-MM-dd"),
      dateTo: format(dateRange.to, "yyyy-MM-dd"),
    });
  };

  if (merchantsLoading || transactionsLoading || reportsLoading) {
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
      {/* Settlement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Settlement</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(settlementStats.totalPending)}</p>
                <p className="text-xs text-gray-500">{settlementStats.pendingCount} reports</p>
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
                <p className="text-sm text-gray-600">Processed Today</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(settlementStats.totalProcessed)}</p>
                <p className="text-xs text-gray-500">{settlementStats.processedCount} reports</p>
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
                <p className="text-sm text-gray-600">Today's Volume</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(todayStats.totalVolume)}</p>
                <p className="text-xs text-gray-500">{todayStats.totalTransactions} transactions</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(todayStats.totalFees)}</p>
                <p className="text-xs text-gray-500">Today's earnings</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Settlement Reports</TabsTrigger>
          <TabsTrigger value="schedule">Auto Settlement</TabsTrigger>
          <TabsTrigger value="history">Settlement History</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Settlement Reports</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleGenerateReport}
                    disabled={generateReportMutation.isPending}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search merchants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All merchants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Merchants</SelectItem>
                    {merchants.map((merchant: Merchant) => (
                      <SelectItem key={merchant.id} value={merchant.id.toString()}>
                        {merchant.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-48">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        "Pick a date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Gross Amount</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report: SettlementReport) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{getMerchantName(report.merchantId!)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(report.reportDate)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{report.totalTransactions}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(report.totalAmount)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600">{formatCurrency(report.totalFees)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">{formatCurrency(report.netAmount)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {report.status === "pending" && (
                            <Button 
                              size="sm"
                              onClick={() => processSettlementMutation.mutate(report.id)}
                              disabled={processSettlementMutation.isPending}
                            >
                              Process
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
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

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Auto Settlement Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Auto settlement configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Settlement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Settlement history viewer coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}