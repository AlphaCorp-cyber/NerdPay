import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/cards/metric-card";
import TransactionsTable from "@/components/tables/transactions-table";
import { ArrowRight, CreditCard, DollarSign, CheckCircle, Users, Settings, Plus, Smartphone, Wallet, Building } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import type { Transaction, PaymentMethod } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ["/api/payment-methods"],
  });

  const recentTransactions = transactions.slice(0, 5);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "mobile_money":
        return <Smartphone className="w-5 h-5 text-green-600" />;
      case "card":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "digital_wallet":
        return <Wallet className="w-5 h-5 text-purple-600" />;
      default:
        return <Building className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (statsLoading || transactionsLoading || paymentMethodsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      {/* Dashboard Metrics */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Transactions"
            value={stats?.totalTransactions?.toLocaleString() || "0"}
            change="+12% from last month"
            icon={CreditCard}
            iconColor="bg-primary/10 text-primary"
          />
          <MetricCard
            title="Total Volume"
            value={formatCurrency(stats?.totalVolume || "0")}
            change="+8% from last month"
            icon={DollarSign}
            iconColor="bg-green-100 text-green-600"
          />
          <MetricCard
            title="Success Rate"
            value={stats?.successRate || "0%"}
            change="+0.3% from last month"
            icon={CheckCircle}
            iconColor="bg-green-100 text-green-600"
          />
          <MetricCard
            title="Active Merchants"
            value={stats?.activeMerchants?.toString() || "0"}
            change="+5 new this month"
            icon={Users}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>
      </section>

      {/* Payment Methods & Recent Transactions */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Methods</CardTitle>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method: PaymentMethod) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(method.isActive ? "active" : "inactive")}>
                        {method.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <TransactionsTable 
                transactions={recentTransactions} 
                paymentMethods={paymentMethods}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
