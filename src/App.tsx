
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HackathonProvider } from "./contexts/HackathonContext";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Judges from "./pages/Judges";
import Import from "./pages/Import";
import Results from "./pages/Results";
import Evaluate from "./pages/Evaluate";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <HackathonProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Login />} />
                  
                  {/* Dashboard and shared routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Route>
                  
                  {/* Admin routes */}
                  <Route element={<DashboardLayout requiredRole="admin" />}>
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/judges" element={<Judges />} />
                    <Route path="/import" element={<Import />} />
                    <Route path="/results" element={<Results />} />
                  </Route>
                  
                  {/* Judge routes */}
                  <Route element={<DashboardLayout requiredRole="judge" />}>
                    <Route path="/evaluate" element={<Evaluate />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </HackathonProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
