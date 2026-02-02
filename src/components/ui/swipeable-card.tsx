import React, { useState, useRef, useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onEdit,
  onDelete,
  className,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const isSwipingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const ACTION_WIDTH = 72;
  const SWIPE_THRESHOLD = 40;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = translateX;
    isSwipingRef.current = true;
    setIsAnimating(false);
  }, [translateX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipingRef.current) return;

    const diff = e.touches[0].clientX - startXRef.current;
    const newTranslate = currentXRef.current + diff;

    // Limit swipe range
    const minTranslate = onDelete ? -ACTION_WIDTH * 2 : onEdit ? -ACTION_WIDTH : 0;
    const maxTranslate = onEdit ? ACTION_WIDTH * 2 : onDelete ? ACTION_WIDTH : 0;

    // Apply resistance at edges
    let clampedTranslate = newTranslate;
    if (newTranslate < minTranslate) {
      clampedTranslate = minTranslate + (newTranslate - minTranslate) * 0.2;
    } else if (newTranslate > maxTranslate) {
      clampedTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.2;
    }

    setTranslateX(clampedTranslate);
  }, [onEdit, onDelete]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    setIsAnimating(true);

    // Determine final position
    if (translateX < -SWIPE_THRESHOLD && onDelete) {
      // Show delete action
      setTranslateX(-ACTION_WIDTH);
    } else if (translateX > SWIPE_THRESHOLD && onEdit) {
      // Show edit action
      setTranslateX(ACTION_WIDTH);
    } else {
      // Reset to center
      setTranslateX(0);
    }
  }, [translateX, onEdit, onDelete]);

  const handleAction = useCallback((action: 'edit' | 'delete') => {
    setIsAnimating(true);
    setTranslateX(0);
    
    setTimeout(() => {
      if (action === 'edit' && onEdit) onEdit();
      if (action === 'delete' && onDelete) onDelete();
    }, 200);
  }, [onEdit, onDelete]);

  const resetPosition = useCallback(() => {
    setIsAnimating(true);
    setTranslateX(0);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-lg', className)}
    >
      {/* Edit action (left side, revealed when swiping right) */}
      {onEdit && (
        <button
          onClick={() => handleAction('edit')}
          className={cn(
            'absolute left-0 top-0 bottom-0 flex items-center justify-center bg-primary text-primary-foreground transition-opacity',
            translateX > 0 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: ACTION_WIDTH }}
        >
          <div className="flex flex-col items-center gap-1">
            <Edit className="w-5 h-5" />
            <span className="text-[10px] font-medium">Edit</span>
          </div>
        </button>
      )}

      {/* Delete action (right side, revealed when swiping left) */}
      {onDelete && (
        <button
          onClick={() => handleAction('delete')}
          className={cn(
            'absolute right-0 top-0 bottom-0 flex items-center justify-center bg-destructive text-destructive-foreground transition-opacity',
            translateX < 0 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: ACTION_WIDTH }}
        >
          <div className="flex flex-col items-center gap-1">
            <Trash2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Delete</span>
          </div>
        </button>
      )}

      {/* Main content */}
      <div
        className={cn(
          'relative bg-background',
          isAnimating && 'transition-transform duration-200 ease-out'
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={translateX !== 0 ? resetPosition : undefined}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableCard;
