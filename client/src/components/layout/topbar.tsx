import { Bell, User, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useEnvironment } from "@/contexts/environment-context";

const pageTitle = {
  "/": "Dashboard Overview",
  "/transactions": "Transactions",
  "/merchants": "Merchants",
  "/payment-methods": "Payment Methods",
  "/compliance": "Compliance & KYC",
  "/settlement": "Settlement Reports",
  "/webhooks": "Webhooks",
  "/api-docs": "API Documentation",
  "/settings": "Settings",
};

const pageDescription = {
  "/": "Monitor your payment gateway performance",
  "/transactions": "View and manage all transactions",
  "/merchants": "Manage merchant accounts and onboarding",
  "/payment-methods": "Configure and manage payment methods",
  "/compliance": "KYC management and compliance monitoring",
  "/settlement": "Financial settlement and reporting",
  "/webhooks": "Configure webhook endpoints",
  "/api-docs": "Integration guide and API reference",
  "/settings": "System settings and configuration",
};

export default function Topbar() {
  const [location] = useLocation();
  const { environment, setEnvironment, isLive } = useEnvironment();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {pageTitle[location as keyof typeof pageTitle] || "BankPay Gateway"}
            </h1>
            <Badge 
              className={isLive 
                ? "bg-red-100 text-red-800 border-red-200" 
                : "bg-green-100 text-green-800 border-green-200"
              }
            >
              {isLive ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  LIVE
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  SANDBOX
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {pageDescription[location as keyof typeof pageDescription] || "Banking Portal"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  Sandbox
                </div>
              </SelectItem>
              <SelectItem value="live">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-red-600" />
                  Live
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Bank Admin</p>
              <p className="text-gray-500">System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
