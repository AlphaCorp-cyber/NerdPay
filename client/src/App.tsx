import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnvironmentProvider } from "@/contexts/environment-context";
import Dashboard from "@/pages/dashboard";
import PaymentMethods from "@/pages/payment-methods";
import Transactions from "@/pages/transactions";
import Merchants from "@/pages/merchants";
import Compliance from "@/pages/compliance";
import Settlement from "@/pages/settlement";
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
          <Route path="/transactions" component={Transactions} />
          <Route path="/merchants" component={Merchants} />
          <Route path="/payment-methods" component={PaymentMethods} />
          <Route path="/compliance" component={Compliance} />
          <Route path="/settlement" component={Settlement} />
          <Route path="/webhooks" component={Webhooks} />
          <Route path="/api-docs" component={ApiDocs} />
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
      <EnvironmentProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </EnvironmentProvider>
    </QueryClientProvider>
  );
}

export default App;
