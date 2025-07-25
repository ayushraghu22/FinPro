import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Objective from "./pages/Objective";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import { BillsProvider } from "./contexts/bills-context";
import { TransactionsProvider } from "./contexts/transactions-context";
import { InventoryProvider } from "./contexts/inventory-context";
import Transactions from "./pages/Transactions";
import Inventory from "./pages/Inventory";
import ProfitLoss from "./pages/ProfitLoss";
import UploadInvoice from "./pages/UploadInvoice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BillsProvider>
          <TransactionsProvider>
            <InventoryProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/objective" element={<Objective />} />
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profit-loss" element={<ProfitLoss />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/upload-invoice" element={<UploadInvoice />} />
                {/* TODO: Add remaining feature pages */}
                {/* <Route path="/finances" element={<Finances />} /> */}
                {/* <Route path="/profit-loss" element={<ProfitLoss />} /> */}
                {/* <Route path="/loans" element={<Loans />} /> */}
                {/* <Route path="/rents" element={<Rents />} /> */}
                {/* <Route path="/upload-invoice" element={<UploadInvoice />} /> */}
                {/* <Route path="/sales" element={<Sales />} /> */}
                {/* <Route path="/reports" element={<Reports />} /> */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/transactions" element={<Transactions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </InventoryProvider>
          </TransactionsProvider>
        </BillsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
