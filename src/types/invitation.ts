// Invitation Types
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
export type InvitationRole = 'TENANT_ADMIN' | 'TEACHER';

export interface TenantInvitation {
  id: string;
  tenantId: string;
  tenantName: string;
  email: string;
  name?: string;
  role: InvitationRole;
  status: InvitationStatus;
  token: string;
  invitedBy: string;
  invitedByName: string;
  sentAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationFormData {
  email: string;
  name?: string;
}

export interface AcceptInvitationFormData {
  name: string;
  password: string;
  confirmPassword: string;
}
