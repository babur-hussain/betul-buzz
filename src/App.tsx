import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLenis } from "@/hooks/use-lenis";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/dashboard/Dashboard";
import LoginTest from "./components/auth/LoginTest";
import AuthDebug from "./components/auth/AuthDebug";
import QuickTest from "./components/auth/QuickTest";
import AdminSetup from "./components/auth/AdminSetup";
import GoogleIntegrationsDemo from "./pages/GoogleIntegrationsDemo";
import GooglePlacesSearch from "./components/business/GooglePlacesSearch";

const queryClient = new QueryClient();

// Lenis Provider Component
const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  useLenis(); // Initialize Lenis
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LenisProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
                                 <Route path="/dashboard" element={<Dashboard />} />
                   <Route path="/login-test" element={<LoginTest />} />
                   <Route path="/auth-debug" element={<AuthDebug />} />
                   <Route path="/quick-test" element={<QuickTest />} />
                   <Route path="/admin-setup" element={<AdminSetup />} />
                   <Route path="/google-demo" element={<GoogleIntegrationsDemo />} />
                   <Route path="/google-search" element={<GooglePlacesSearch />} />
                   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                   <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LenisProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
