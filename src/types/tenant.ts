// =============================================
// Tenant App Module Data Models
// =============================================

// Student
export interface Student {
  id: string;
  userId?: string;
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  academicClassId: string;
  className: string;
  batchId?: string;
  batchName?: string;
  roll?: string;
  group?: string;
  shift?: string;
  section?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  imageUrl?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  presentAddress?: string;
  permanentAddress?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Batch
export interface Batch {
  id: string;
  name: string;
  academicClassId: string;
  className: string;
  academicYear: string;
  capacity?: number;
  currentSize: number;
  isActive: boolean;
  createdAt: string;
}

// Teacher
export interface Teacher {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  subjectIds: string[];
  subjectNames: string[];
  designation?: string;
  department?: string;
  joinDate?: string;
  isActive: boolean;
  createdAt: string;
}

// Exam
export interface Exam {
  id: string;
  title: string;
  description?: string;
  type: 'WEEKLY' | 'MONTHLY' | 'TERM' | 'MOCK' | 'PRACTICE';
  total: number;
  mcq?: number;
  cq?: number;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  hasNegativeMark: boolean;
  negativeMark: number;
  startDate: string;
  endDate: string;
  batchId?: string;
  batchName?: string;
  teacherId?: string;
  teacherName?: string;
  status: 'Pending' | 'Published' | 'Ongoing' | 'Completed' | 'Archived';
  isPublished: boolean;
  isActive: boolean;
  attemptCount: number;
  avgScore: number;
  createdAt: string;
}

// Exam Attempt
export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  totalQuestions: number;
  duration?: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Auto-Submitted';
  startTime?: string;
  endTime?: string;
  rank?: number;
  createdAt: string;
}

// Student Analytics
export interface StudentAnalytics {
  id: string;
  studentId: string;
  studentName: string;
  totalExamsAttempted: number;
  averageScore: number;
  averagePercentage: number;
  strongSubjects: string[];
  weakSubjects: string[];
  attendancePercentage: number;
  overallRank?: number;
  classRank?: number;
  currentStreak: number;
  bestStreak: number;
}

// Attendance
export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  batchId?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  markedBy?: string;
}

// Notification
export interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'STUDENT' | 'TEACHER';
  title: string;
  message: string;
  type: 'EXAM_SCHEDULED' | 'RESULT_PUBLISHED' | 'ANNOUNCEMENT' | 'REMINDER';
  isRead: boolean;
  createdAt: string;
}

// Announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetType: 'ALL' | 'CLASS' | 'BATCH' | 'INDIVIDUAL';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  isPublished: boolean;
  isPinned: boolean;
  publishAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

// Guardian
export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phonePrimary: string;
  phoneSecondary?: string;
  occupation?: string;
  address?: string;
  nidNumber?: string;
  imageUrl?: string;
  studentIds: string[];
  studentNames: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Staff (non-teaching)
export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  email?: string;
  phone: string;
  designation: string;
  department: string;
  dateOfBirth?: string;
  gender?: string;
  joiningDate: string;
  salary?: number;
  address?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Academic Year
export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
  totalStudents: number;
  totalBatches: number;
  createdAt: string;
}

// Timetable
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  batchName: string;
  className: string;
  room?: string;
  type: 'CLASS' | 'BREAK' | 'LAB' | 'ASSEMBLY';
}

export interface Timetable {
  id: string;
  name: string;
  batchId: string;
  batchName: string;
  className: string;
  academicYearId: string;
  academicYear: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  slots: TimetableSlot[];
  createdAt: string;
}

// Dashboard Stats
export interface TenantDashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalBatches: number;
  totalExams: number;
  upcomingExams: number;
  ongoingExams: number;
  completedExams: number;
  averageAttendance: number;
  averageExamScore: number;
  totalAttempts: number;
  pendingResults: number;
  totalGuardians: number;
  totalStaff: number;
}
