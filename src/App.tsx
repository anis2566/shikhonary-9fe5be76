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
import McqImport from "./pages/admin/academic/McqImport";
import CqList from "./pages/admin/academic/CqList";
import CqForm from "./pages/admin/academic/CqForm";

// Subscription Plans
import SubscriptionPlanList from "./pages/admin/subscription/SubscriptionPlanList";
import SubscriptionPlanDetails from "./pages/admin/subscription/SubscriptionPlanDetails";
import SubscriptionPlanForm from "./pages/admin/subscription/SubscriptionPlanForm";

// Subscriptions
import SubscriptionList from "./pages/admin/subscription/SubscriptionList";
import SubscriptionDetails from "./pages/admin/subscription/SubscriptionDetails";
import SubscriptionForm from "./pages/admin/subscription/SubscriptionForm";

import CqDetails from "./pages/admin/academic/CqDetails";

// Tenant Dashboard
import TenantLayout from "./layouts/TenantLayout";
import TenantOverview from "./pages/tenant/TenantOverview";
import StudentList from "./pages/tenant/StudentList";
import StudentCreate from "./pages/tenant/StudentCreate";
import StudentDetails from "./pages/tenant/StudentDetails";
import TeacherList from "./pages/tenant/TeacherList";
import GuardianList from "./pages/tenant/GuardianList";
import GuardianDetails from "./pages/tenant/GuardianDetails";
import StaffList from "./pages/tenant/StaffList";
import StaffDetails from "./pages/tenant/StaffDetails";
import BatchList from "./pages/tenant/BatchList";
import BatchCreate from "./pages/tenant/BatchCreate";
import BatchDetails from "./pages/tenant/BatchDetails";
import ExamList from "./pages/tenant/ExamList";
import ExamCreate from "./pages/tenant/ExamCreate";
import ExamQuestionsPage from "./pages/tenant/ExamQuestionsPage";
import ResultsPage from "./pages/tenant/ResultsPage";
import AnalyticsPage from "./pages/tenant/AnalyticsPage";
import AttendancePage from "./pages/tenant/AttendancePage";
import AnnouncementsPage from "./pages/tenant/AnnouncementsPage";
import TenantSettings from "./pages/tenant/TenantSettings";
import CalendarPage from "./pages/tenant/CalendarPage";
import CommunicationsPage from "./pages/tenant/CommunicationsPage";
import ReportsPage from "./pages/tenant/ReportsPage";
import QuestionBankPage from "./pages/tenant/QuestionBankPage";
import TenantMcqDetailsPage from "./pages/tenant/McqDetailsPage";
import TenantCqDetailsPage from "./pages/tenant/CqDetailsPage";
import QuestionPaperBuilder from "./pages/tenant/QuestionPaperBuilder";
import UnauthorizedPage from "./pages/tenant/UnauthorizedPage";
import EmailTemplatePreview from "./pages/admin/EmailTemplatePreview";
import AcademicYearList from "./pages/tenant/AcademicYearList";
import AcademicYearDetails from "./pages/tenant/AcademicYearDetails";
import AcademicYearCreate from "./pages/tenant/AcademicYearCreate";
import TimetablePage from "./pages/tenant/TimetablePage";
import TeacherAttendancePage from "./pages/tenant/TeacherAttendancePage";
import MarkAttendancePage from "./pages/tenant/MarkAttendancePage";

// Invitation
import AcceptInvitation from "./pages/invitation/AcceptInvitation";

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
            
            {/* Invitation Routes (Public) */}
            <Route path="/invitation/accept" element={<AcceptInvitation />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="tenants/:id" element={<TenantDetails />} />
              <Route path="tenants/create" element={<CreateTenant />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="settings" element={<Settings />} />
              <Route path="email-template-preview" element={<EmailTemplatePreview />} />
              {/* Subscription Plans */}
              <Route path="subscription-plans" element={<SubscriptionPlanList />} />
              <Route path="subscription-plans/create" element={<SubscriptionPlanForm />} />
              <Route path="subscription-plans/:id" element={<SubscriptionPlanDetails />} />
              <Route path="subscription-plans/:id/edit" element={<SubscriptionPlanForm />} />
              
              {/* Subscriptions */}
              <Route path="subscriptions" element={<SubscriptionList />} />
              <Route path="subscriptions/create" element={<SubscriptionForm />} />
              <Route path="subscriptions/:id" element={<SubscriptionDetails />} />
              <Route path="subscriptions/:id/edit" element={<SubscriptionForm />} />
              
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
              <Route path="mcqs/import" element={<McqImport />} />
              <Route path="mcqs/:id" element={<McqDetails />} />
              <Route path="mcqs/:id/edit" element={<McqForm />} />
              
              {/* Question Bank - CQs */}
              <Route path="cqs" element={<CqList />} />
              <Route path="cqs/create" element={<CqForm />} />
              <Route path="cqs/:id" element={<CqDetails />} />
              <Route path="cqs/:id/edit" element={<CqForm />} />
            </Route>

            {/* Tenant Dashboard */}
            <Route path="/tenant" element={<TenantLayout />}>
              <Route index element={<TenantOverview />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/create" element={<StudentCreate />} />
              <Route path="students/:id" element={<StudentDetails />} />
              <Route path="teachers" element={<TeacherList />} />
              <Route path="guardians" element={<GuardianList />} />
              <Route path="guardians/:id" element={<GuardianDetails />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="staff/:id" element={<StaffDetails />} />
              <Route path="batches" element={<BatchList />} />
              <Route path="batches/create" element={<BatchCreate />} />
              <Route path="batches/:id" element={<BatchDetails />} />
              <Route path="batches/:id/edit" element={<BatchCreate />} />
              <Route path="exams" element={<ExamList />} />
              <Route path="exams/create" element={<ExamCreate />} />
              <Route path="exams/:id/questions" element={<ExamQuestionsPage />} />
              <Route path="question-bank" element={<QuestionBankPage />} />
              <Route path="question-bank/mcqs/:id" element={<TenantMcqDetailsPage />} />
              <Route path="question-bank/cqs/:id" element={<TenantCqDetailsPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="communications" element={<CommunicationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<TenantSettings />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="question-paper-builder" element={<QuestionPaperBuilder />} />
              <Route path="academic-years" element={<AcademicYearList />} />
              <Route path="academic-years/create" element={<AcademicYearCreate />} />
              <Route path="academic-years/:id" element={<AcademicYearDetails />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="teacher-attendance" element={<TeacherAttendancePage />} />
              <Route path="mark-attendance" element={<MarkAttendancePage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />
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
