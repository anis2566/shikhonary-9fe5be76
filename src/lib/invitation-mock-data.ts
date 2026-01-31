import { TenantInvitation } from '@/types/invitation';

// Helper to generate mock invitations
const generateMockInvitations = (): TenantInvitation[] => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'inv_1',
      tenantId: '1',
      tenantName: 'ABC High School',
      email: 'newadmin@abchigh.edu.bd',
      name: 'Rahul Ahmed',
      role: 'TENANT_ADMIN',
      status: 'PENDING',
      token: 'tok_abc123def456',
      invitedBy: '1',
      invitedByName: 'Admin User',
      sentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: sevenDaysLater,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'inv_2',
      tenantId: '1',
      tenantName: 'ABC High School',
      email: 'urgent.invite@test.com',
      role: 'TENANT_ADMIN',
      status: 'PENDING',
      token: 'tok_urgent789',
      invitedBy: '1',
      invitedByName: 'Admin User',
      sentAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      expiresAt: twoDaysLater,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'inv_3',
      tenantId: '1',
      tenantName: 'ABC High School',
      email: 'accepted.admin@abchigh.edu.bd',
      name: 'Kamal Hossain',
      role: 'TENANT_ADMIN',
      status: 'ACCEPTED',
      token: 'tok_accepted123',
      invitedBy: '1',
      invitedByName: 'Admin User',
      sentAt: twoWeeksAgo,
      expiresAt: lastWeek,
      acceptedAt: new Date(twoWeeksAgo.getTime() + 1 * 24 * 60 * 60 * 1000),
      createdAt: twoWeeksAgo,
      updatedAt: new Date(twoWeeksAgo.getTime() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'inv_4',
      tenantId: '1',
      tenantName: 'ABC High School',
      email: 'expired@test.com',
      role: 'TENANT_ADMIN',
      status: 'EXPIRED',
      token: 'tok_expired456',
      invitedBy: '1',
      invitedByName: 'Admin User',
      sentAt: twoWeeksAgo,
      expiresAt: yesterday,
      createdAt: twoWeeksAgo,
      updatedAt: yesterday,
    },
    {
      id: 'inv_5',
      tenantId: '1',
      tenantName: 'ABC High School',
      email: 'revoked@test.com',
      name: 'Cancelled User',
      role: 'TENANT_ADMIN',
      status: 'REVOKED',
      token: 'tok_revoked789',
      invitedBy: '1',
      invitedByName: 'Admin User',
      sentAt: lastWeek,
      expiresAt: sevenDaysLater,
      revokedAt: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
      createdAt: lastWeek,
      updatedAt: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    // Invitations for other tenants
    {
      id: 'inv_6',
      tenantId: '2',
      tenantName: 'XYZ Coaching Center',
      email: 'manager@xyzcoaching.com',
      name: 'Fatima Khan',
      role: 'TENANT_ADMIN',
      status: 'PENDING',
      token: 'tok_xyz123',
      invitedBy: '1',
      invitedByName: 'Admin User',
      sentAt: now,
      expiresAt: sevenDaysLater,
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const mockInvitations = generateMockInvitations();

export const getInvitationsByTenantId = (tenantId: string): TenantInvitation[] => {
  return mockInvitations.filter(inv => inv.tenantId === tenantId);
};

export const getInvitationByToken = (token: string): TenantInvitation | undefined => {
  return mockInvitations.find(inv => inv.token === token);
};

export const getPendingInvitationsCount = (tenantId: string): number => {
  return mockInvitations.filter(inv => inv.tenantId === tenantId && inv.status === 'PENDING').length;
};
