import { Link, useLocation } from "wouter";
import { CreditCard, LayoutDashboard, DollarSign, Users, Code, Webhook, Settings, Shield, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Merchants", href: "/merchants", icon: Users },
  { name: "Payment Methods", href: "/payment-methods", icon: DollarSign },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Settlement", href: "/settlement", icon: Receipt },
  { name: "Webhooks", href: "/webhooks", icon: Webhook },
  { name: "API Documentation", href: "/api-docs", icon: Code },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg sidebar-transition">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BankPay Gateway</h1>
            <p className="text-xs text-gray-500">Banking Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
