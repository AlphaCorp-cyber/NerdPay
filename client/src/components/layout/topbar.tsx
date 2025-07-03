import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const pageTitle = {
  "/": "Dashboard Overview",
  "/payment-methods": "Payment Methods",
  "/transactions": "Transactions",
  "/merchants": "Merchants",
  "/api-docs": "API Documentation",
  "/webhooks": "Webhooks",
  "/settings": "Settings",
};

const pageDescription = {
  "/": "Monitor your payment gateway performance",
  "/payment-methods": "Configure and manage payment methods",
  "/transactions": "View and manage all transactions",
  "/merchants": "Manage merchant accounts",
  "/api-docs": "Integration guide and API reference",
  "/webhooks": "Configure webhook endpoints",
  "/settings": "System settings and configuration",
};

export default function Topbar() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitle[location as keyof typeof pageTitle] || "ZimPay Gateway"}
          </h1>
          <p className="text-sm text-gray-600">
            {pageDescription[location as keyof typeof pageDescription] || "Admin Dashboard"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
