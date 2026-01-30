import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/auth/Auth";

// Admin Dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/admin/Overview";
import Users from "./pages/admin/Users";
import Tenants from "./pages/admin/Tenants";
import TenantDetails from "./pages/admin/TenantDetails";
import CreateTenant from "./pages/admin/CreateTenant";
import Sessions from "./pages/admin/Sessions";
import Settings from "./pages/admin/Settings";
import Setup from "./pages/admin/Setup";

// Academic Management - Lists
import ClassList from "./pages/admin/academic/ClassList";
import SubjectList from "./pages/admin/academic/SubjectList";
import ChapterList from "./pages/admin/academic/ChapterList";
import TopicList from "./pages/admin/academic/TopicList";
import SubTopicList from "./pages/admin/academic/SubTopicList";
import AcademicTree from "./pages/admin/academic/AcademicTree";
import ClassContentTree from "./pages/admin/academic/ClassContentTree";

// Academic Management - Details
import ClassDetails from "./pages/admin/academic/ClassDetails";
import SubjectDetails from "./pages/admin/academic/SubjectDetails";
import ChapterDetails from "./pages/admin/academic/ChapterDetails";
import TopicDetails from "./pages/admin/academic/TopicDetails";
import SubTopicDetails from "./pages/admin/academic/SubTopicDetails";

// Academic Management - Forms
import ClassForm from "./pages/admin/academic/ClassForm";
import SubjectForm from "./pages/admin/academic/SubjectForm";
import ChapterForm from "./pages/admin/academic/ChapterForm";
import TopicForm from "./pages/admin/academic/TopicForm";
import SubTopicForm from "./pages/admin/academic/SubTopicForm";

// Question Bank
import McqList from "./pages/admin/academic/McqList";
import McqForm from "./pages/admin/academic/McqForm";
import McqDetails from "./pages/admin/academic/McqDetails";
import CqList from "./pages/admin/academic/CqList";
import CqForm from "./pages/admin/academic/CqForm";
import CqDetails from "./pages/admin/academic/CqDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/setup" element={<Setup />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="tenants/:id" element={<TenantDetails />} />
              <Route path="tenants/create" element={<CreateTenant />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Academic Management - Tree View */}
              <Route path="academic-tree" element={<AcademicTree />} />
              
              {/* Academic Management - Classes */}
              <Route path="classes" element={<ClassList />} />
              <Route path="classes/create" element={<ClassForm />} />
              <Route path="classes/:id" element={<ClassDetails />} />
              <Route path="classes/:id/tree" element={<ClassContentTree />} />
              <Route path="classes/:id/edit" element={<ClassForm />} />
              
              {/* Academic Management - Subjects */}
              <Route path="subjects" element={<SubjectList />} />
              <Route path="subjects/create" element={<SubjectForm />} />
              <Route path="subjects/:id" element={<SubjectDetails />} />
              <Route path="subjects/:id/edit" element={<SubjectForm />} />
              
              {/* Academic Management - Chapters */}
              <Route path="chapters" element={<ChapterList />} />
              <Route path="chapters/create" element={<ChapterForm />} />
              <Route path="chapters/:id" element={<ChapterDetails />} />
              <Route path="chapters/:id/edit" element={<ChapterForm />} />
              
              {/* Academic Management - Topics */}
              <Route path="topics" element={<TopicList />} />
              <Route path="topics/create" element={<TopicForm />} />
              <Route path="topics/:id" element={<TopicDetails />} />
              <Route path="topics/:id/edit" element={<TopicForm />} />
              
              {/* Academic Management - SubTopics */}
              <Route path="subtopics" element={<SubTopicList />} />
              <Route path="subtopics/create" element={<SubTopicForm />} />
              <Route path="subtopics/:id" element={<SubTopicDetails />} />
              <Route path="subtopics/:id/edit" element={<SubTopicForm />} />
              
              {/* Question Bank - MCQs */}
              <Route path="mcqs" element={<McqList />} />
              <Route path="mcqs/create" element={<McqForm />} />
              <Route path="mcqs/:id" element={<McqDetails />} />
              <Route path="mcqs/:id/edit" element={<McqForm />} />
              
              {/* Question Bank - CQs */}
              <Route path="cqs" element={<CqList />} />
              <Route path="cqs/create" element={<CqForm />} />
              <Route path="cqs/:id" element={<CqDetails />} />
              <Route path="cqs/:id/edit" element={<CqForm />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
