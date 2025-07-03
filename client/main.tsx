import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsPanel } from "@/components/ui/notifications-panel";
import { FallbackBanner } from "@/components/ui/fallback-banner";
import { useState, createContext, useContext } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerOrders from "./pages/ManagerOrders";
import ManagerArticles from "./pages/ManagerArticles";
import ManagerProductDetails from "./pages/ManagerProductDetails";
import NotFound from "./pages/NotFound";

interface NotificationContextType {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
};

const queryClient = new QueryClient();

const App = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationContext.Provider
            value={{ showNotifications, setShowNotifications }}
          >
            <Toaster />
            <Sonner />
            <FallbackBanner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-order" element={<NewOrder />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
                <Route
                  path="/manager-dashboard"
                  element={<ManagerDashboard />}
                />
                <Route path="/manager-orders" element={<ManagerOrders />} />
                <Route path="/manager-articles" element={<ManagerArticles />} />
                <Route
                  path="/manager-product-details/:id"
                  element={<ManagerProductDetails />}
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <NotificationsPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </BrowserRouter>
          </NotificationContext.Provider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
