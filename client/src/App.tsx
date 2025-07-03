import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import PaymentMethods from "@/pages/payment-methods";
import Transactions from "@/pages/transactions";
import Merchants from "@/pages/merchants";
import ApiDocs from "@/pages/api-docs";
import Webhooks from "@/pages/webhooks";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

function Router() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Topbar />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/payment-methods" component={PaymentMethods} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/merchants" component={Merchants} />
          <Route path="/api-docs" component={ApiDocs} />
          <Route path="/webhooks" component={Webhooks} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
