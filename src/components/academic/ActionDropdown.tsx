import React from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, Copy, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ActionDropdownProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onToggleStatus?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isActive?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  isActive = true,
  canMoveUp = true,
  canMoveDown = true,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg z-50">
        {onView && (
          <DropdownMenuItem onClick={onView} className="cursor-pointer">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
        )}
        {(onMoveUp || onMoveDown) && (
          <>
            <DropdownMenuSeparator />
            {onMoveUp && canMoveUp && (
              <DropdownMenuItem onClick={onMoveUp} className="cursor-pointer">
                <ArrowUp className="h-4 w-4 mr-2" />
                Move Up
              </DropdownMenuItem>
            )}
            {onMoveDown && canMoveDown && (
              <DropdownMenuItem onClick={onMoveDown} className="cursor-pointer">
                <ArrowDown className="h-4 w-4 mr-2" />
                Move Down
              </DropdownMenuItem>
            )}
          </>
        )}
        {onToggleStatus && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggleStatus} className="cursor-pointer">
              {isActive ? (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
