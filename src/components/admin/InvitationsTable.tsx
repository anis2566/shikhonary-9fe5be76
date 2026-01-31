import React, { useState } from 'react';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import {
  Mail,
  MoreHorizontal,
  RotateCw,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { TenantInvitation, InvitationStatus } from '@/types/invitation';
import { cn } from '@/lib/utils';

interface InvitationsTableProps {
  invitations: TenantInvitation[];
  onRefresh?: () => void;
}

const statusConfig: Record<InvitationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  PENDING: { 
    label: 'Pending', 
    variant: 'outline',
    icon: <Clock className="h-3 w-3" />
  },
  ACCEPTED: { 
    label: 'Accepted', 
    variant: 'default',
    icon: <CheckCircle2 className="h-3 w-3" />
  },
  EXPIRED: { 
    label: 'Expired', 
    variant: 'destructive',
    icon: <XCircle className="h-3 w-3" />
  },
  REVOKED: { 
    label: 'Revoked', 
    variant: 'secondary',
    icon: <Ban className="h-3 w-3" />
  },
};

export const InvitationsTable: React.FC<InvitationsTableProps> = ({
  invitations,
  onRefresh,
}) => {
  const { toast } = useToast();
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<TenantInvitation | null>(null);

  const handleResend = async () => {
    if (!selectedInvitation) return;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: 'Invitation resent',
      description: `A new invitation has been sent to ${selectedInvitation.email}`,
    });
    
    setResendDialogOpen(false);
    setSelectedInvitation(null);
    onRefresh?.();
  };

  const handleRevoke = async () => {
    if (!selectedInvitation) return;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: 'Invitation revoked',
      description: 'The invitation has been revoked',
    });
    
    setRevokeDialogOpen(false);
    setSelectedInvitation(null);
    onRefresh?.();
  };

  const isExpiringSoon = (expiresAt: Date) => {
    return differenceInHours(new Date(expiresAt), new Date()) < 24;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const status = statusConfig[invitation.status];
            const expiringSoon = invitation.status === 'PENDING' && isExpiringSoon(invitation.expiresAt);
            
            return (
              <TableRow key={invitation.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{invitation.email}</span>
                    {invitation.name && (
                      <span className="text-sm text-muted-foreground">{invitation.name}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {invitation.role.replace('_', ' ').toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={status.variant}
                    className={cn(
                      'gap-1',
                      invitation.status === 'PENDING' && 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
                      invitation.status === 'ACCEPTED' && 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                    )}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {invitation.invitedByName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(invitation.sentAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {invitation.status === 'PENDING' ? (
                      <>
                        <span className={cn(
                          'text-sm',
                          expiringSoon ? 'text-amber-600 font-medium' : 'text-muted-foreground'
                        )}>
                          {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
                        </span>
                        {expiringSoon && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(invitation.expiresAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {invitation.status === 'PENDING' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setResendDialogOpen(true);
                            }}
                          >
                            <RotateCw className="mr-2 h-4 w-4" />
                            Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setRevokeDialogOpen(true);
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Revoke Invitation
                          </DropdownMenuItem>
                        </>
                      )}
                      {invitation.status !== 'PENDING' && (
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Resend Confirmation Dialog */}
      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a new invitation email to {selectedInvitation?.email} with a fresh 7-day expiry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResend}>
              Resend Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will invalidate the invitation link. {selectedInvitation?.email} will no longer be able to accept this invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvitationsTable;
