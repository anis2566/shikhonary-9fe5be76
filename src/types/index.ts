// User Roles
export type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

// Tenant Types
export type TenantType = 'SCHOOL' | 'COACHING_CENTER' | 'INDIVIDUAL' | 'TRAINING_CENTER' | 'UNIVERSITY' | 'OTHER';

// Subscription
export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
export type TenantDatabaseStatus = 'PROVISIONING' | 'ACTIVE' | 'MIGRATING' | 'DELETING' | 'DELETED' | 'FAILED';

// Difficulty
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: string;
  role: UserRole;
  isActive: boolean;
}

// Tenant
export interface Tenant {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  type: TenantType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
  subdomain: string;
  customDomain?: string;
  customDomainVerified: boolean;
  tenantDatabaseName: string;
  tenantDatabaseConnectionString?: string;
  tenantDatabaseStatus: TenantDatabaseStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  monthlyPriceBDT: number;
  yearlyPriceBDT: number;
  studentLimit: number;
  teacherLimit: number;
  examLimit: number;
  storageLimit: number;
  studentCount: number;
  teacherCount: number;
  examCount: number;
  storageUsedMB: number;
  isActive: boolean;
  isSuspended: boolean;
  suspendReason?: string;
  currentAcademicYear?: string;
  features?: Record<string, boolean>;
  metadata?: Record<string, string>;
  createdById?: string;
}

// Session
export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}

// Academic Class
export interface AcademicClass {
  id: string;
  name: string;
  level: string;
  displayName: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Academic Subject
export interface AcademicSubject {
  id: string;
  name: string;
  code?: string;
  displayName: string;
  position: number;
  isActive: boolean;
  classId: string;
  class?: AcademicClass;
  createdAt: Date;
  updatedAt: Date;
}

// Academic Chapter
export interface AcademicChapter {
  id: string;
  name: string;
  displayName: string;
  position: number;
  isActive: boolean;
  subjectId: string;
  subject?: AcademicSubject;
  createdAt: Date;
  updatedAt: Date;
}

// Academic Topic
export interface AcademicTopic {
  id: string;
  name: string;
  displayName: string;
  position: number;
  isActive: boolean;
  chapterId: string;
  chapter?: AcademicChapter;
  createdAt: Date;
  updatedAt: Date;
}

// Academic SubTopic
export interface AcademicSubTopic {
  id: string;
  name: string;
  displayName: string;
  position: number;
  isActive: boolean;
  topicId: string;
  topic?: AcademicTopic;
  createdAt: Date;
  updatedAt: Date;
}

// MCQ (Multiple Choice Question)
export interface Mcq {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  difficulty: Difficulty;
  marks: number;
  subjectId: string;
  subject?: AcademicSubject;
  chapterId: string;
  chapter?: AcademicChapter;
  topicId?: string;
  topic?: AcademicTopic;
  subTopicId?: string;
  subTopic?: AcademicSubTopic;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// CQ (Creative Question)
export interface Cq {
  id: string;
  questionA: string;
  questionB: string;
  questionC: string;
  questionD: string;
  context?: string;
  marks: number;
  subjectId: string;
  subject?: AcademicSubject;
  chapterId: string;
  chapter?: AcademicChapter;
  topicId?: string;
  topic?: AcademicTopic;
  subTopicId?: string;
  subTopic?: AcademicSubTopic;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
