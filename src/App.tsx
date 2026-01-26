import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Admin Dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/admin/Overview";
import Users from "./pages/admin/Users";
import Tenants from "./pages/admin/Tenants";
import TenantDetails from "./pages/admin/TenantDetails";
import CreateTenant from "./pages/admin/CreateTenant";
import Sessions from "./pages/admin/Sessions";
import Settings from "./pages/admin/Settings";

// Academic Management
import Boards from "./pages/admin/academic/Boards";
import Classes from "./pages/admin/academic/Classes";
import Subjects from "./pages/admin/academic/Subjects";
import Chapters from "./pages/admin/academic/Chapters";
import Topics from "./pages/admin/academic/Topics";
import SubTopics from "./pages/admin/academic/SubTopics";
import McqList from "./pages/admin/academic/McqList";
import McqForm from "./pages/admin/academic/McqForm";
import CqList from "./pages/admin/academic/CqList";
import CqForm from "./pages/admin/academic/CqForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="tenants/:id" element={<TenantDetails />} />
            <Route path="tenants/create" element={<CreateTenant />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Academic Management */}
            <Route path="boards" element={<Boards />} />
            <Route path="classes" element={<Classes />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="chapters" element={<Chapters />} />
            <Route path="topics" element={<Topics />} />
            <Route path="subtopics" element={<SubTopics />} />
            <Route path="mcqs" element={<McqList />} />
            <Route path="mcqs/create" element={<McqForm />} />
            <Route path="mcqs/:id" element={<McqForm />} />
            <Route path="mcqs/:id/edit" element={<McqForm />} />
            <Route path="cqs" element={<CqList />} />
            <Route path="cqs/create" element={<CqForm />} />
            <Route path="cqs/:id" element={<CqForm />} />
            <Route path="cqs/:id/edit" element={<CqForm />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
