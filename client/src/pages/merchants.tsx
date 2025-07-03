import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Plus } from "lucide-react";
import MerchantsTable from "@/components/tables/merchants-table";
import MerchantModal from "@/components/modals/merchant-modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Merchant } from "@shared/schema";

export default function Merchants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: merchants = [], isLoading } = useQuery({
    queryKey: ["/api/merchants"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/merchants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchants"] });
      toast({ title: "Success", description: "Merchant deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete merchant", variant: "destructive" });
    },
  });

  const filteredMerchants = merchants.filter((merchant: Merchant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      merchant.businessName.toLowerCase().includes(searchLower) ||
      merchant.name.toLowerCase().includes(searchLower) ||
      merchant.email.toLowerCase().includes(searchLower) ||
      merchant.businessType?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant);
  };

  const handleDelete = (merchant: Merchant) => {
    if (confirm(`Are you sure you want to delete ${merchant.businessName}?`)) {
      deleteMutation.mutate(merchant.id);
    }
  };

  const stats = {
    total: merchants.length,
    active: merchants.filter((m: Merchant) => m.isActive).length,
    inactive: merchants.filter((m: Merchant) => !m.isActive).length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-96 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Merchant Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Merchants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchants Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Merchants</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <MerchantModal />
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
          <MerchantsTable 
            merchants={filteredMerchants}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {editingMerchant && (
        <MerchantModal 
          merchant={editingMerchant} 
          onClose={() => setEditingMerchant(null)}
        />
      )}
    </div>
  );
}
