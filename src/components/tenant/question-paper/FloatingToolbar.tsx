import React, { useEffect, useState, useRef } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  Bold,
  Italic,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FloatingToolbarProps {
  targetRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  textAlign?: 'left' | 'center' | 'right';
  onTextAlignChange?: (align: 'left' | 'center' | 'right') => void;
  showAlignment?: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  targetRef,
  isVisible,
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  textAlign = 'left',
  onTextAlignChange,
  showAlignment = true,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && targetRef.current && toolbarRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const scrollContainer = document.querySelector('.overflow-auto');
      const scrollOffset = scrollContainer?.scrollTop || 0;

      // Position above the element
      let top = targetRect.top - toolbarRect.height - 8 + scrollOffset;
      let left = targetRect.left + (targetRect.width / 2) - (toolbarRect.width / 2);

      // Keep within viewport
      if (left < 10) left = 10;
      if (left + toolbarRect.width > window.innerWidth - 10) {
        left = window.innerWidth - toolbarRect.width - 10;
      }
      if (top < 60) {
        // Position below if not enough space above
        top = targetRect.bottom + 8 + scrollOffset;
      }

      setPosition({ top, left });
    }
  }, [isVisible, targetRef]);

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className={cn(
        'fixed z-50 bg-popover border shadow-lg rounded-lg p-2 flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-200',
        !isVisible && 'hidden'
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      {/* Font Family */}
      <Select value={fontFamily} onValueChange={onFontFamilyChange}>
        <SelectTrigger className="w-28 h-8 text-xs bg-background">
          <Type className="w-3 h-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border shadow-md z-[60]">
          <SelectItem value="Bangla">বাংলা</SelectItem>
          <SelectItem value="SolaimanLipi">SolaimanLipi</SelectItem>
          <SelectItem value="Nikosh">Nikosh</SelectItem>
          <SelectItem value="Kalpurush">Kalpurush</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-px h-6 bg-border" />

      {/* Font Size */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="text-xs font-medium w-6 text-center">{fontSize}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {showAlignment && onTextAlignChange && (
        <>
          <div className="w-px h-6 bg-border" />

          {/* Text Alignment */}
          <ToggleGroup
            type="single"
            value={textAlign}
            onValueChange={(v) => v && onTextAlignChange(v as 'left' | 'center' | 'right')}
            className="gap-0"
          >
            <ToggleGroupItem value="left" size="sm" className="h-7 w-7 p-0">
              <AlignLeft className="w-3 h-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" size="sm" className="h-7 w-7 p-0">
              <AlignCenter className="w-3 h-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" size="sm" className="h-7 w-7 p-0">
              <AlignRight className="w-3 h-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )}

      <div className="w-px h-6 bg-border" />

      {/* Bold & Italic (visual only for now) */}
      <div className="flex items-center gap-0">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Bold className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Italic className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
