import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { getPaymentMethodIcon } from "@/lib/utils";
import PaymentMethodModal from "@/components/modals/payment-method-modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaymentMethod } from "@shared/schema";

export default function PaymentMethods() {
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ["/api/payment-methods"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/payment-methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Success", description: "Payment method deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete payment method", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest("PUT", `/api/payment-methods/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Success", description: "Payment method updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update payment method", variant: "destructive" });
    },
  });

  const handleDelete = (method: PaymentMethod) => {
    if (confirm(`Are you sure you want to delete ${method.name}?`)) {
      deleteMutation.mutate(method.id);
    }
  };

  const handleToggleActive = (method: PaymentMethod) => {
    toggleActiveMutation.mutate({ id: method.id, isActive: !method.isActive });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600">Configure and manage payment methods</p>
        </div>
        <PaymentMethodModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method: PaymentMethod) => (
          <Card key={method.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                  <p className="text-sm text-gray-500 capitalize">{method.type.replace("_", " ")}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEditingMethod(method)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleActive(method)}>
                    <Settings className="w-4 h-4 mr-2" />
                    {method.isActive ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(method)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{method.description}</p>
              <div className="flex items-center justify-between">
                <Badge className={method.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {method.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingMethod(method)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleActive(method)}
                    disabled={toggleActiveMutation.isPending}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingMethod && (
        <PaymentMethodModal 
          paymentMethod={editingMethod} 
          onClose={() => setEditingMethod(null)}
        />
      )}
    </div>
  );
}
