// User Roles
export type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

// Tenant Types
export type TenantType = 'SCHOOL' | 'COACHING_CENTER' | 'INDIVIDUAL' | 'TRAINING_CENTER' | 'UNIVERSITY' | 'OTHER';

// Subscription
export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
export type TenantDatabaseStatus = 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

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
