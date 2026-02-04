import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { PaperQuestion, PaperSettings, ElementStyle, ActiveElementContext, HeaderStyles } from './types';
import EditableQuestion from './EditableQuestion';
import FloatingToolbar from './FloatingToolbar';

interface PaperPreviewProps {
  questions: PaperQuestion[];
  settings: PaperSettings;
  onUpdateQuestion: (question: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: PaperQuestion) => void;
  onReorderQuestions?: (questions: PaperQuestion[]) => void;
  onSettingsChange: (settings: PaperSettings) => void;
  isEditing: boolean;
  zoom?: number | 'auto';
}

// Inline editable styles
const editableBaseClass = 'transition-all duration-200 rounded px-1 -mx-1';
const editableHoverClass = 'hover:bg-primary/10 hover:ring-1 hover:ring-primary/30';
const editableFocusClass = 'focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none';

const PaperPreview: React.FC<PaperPreviewProps> = ({
  questions,
  settings,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
  onSettingsChange,
  isEditing,
  zoom = 'auto',
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeContext, setActiveContext] = useState<ActiveElementContext | null>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [isToolbarInteracting, setIsToolbarInteracting] = useState(false);
  const activeRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(questions, oldIndex, newIndex);
        // Renumber questions
        const renumbered = reordered.map((q, idx) => ({ ...q, number: idx + 1 }));
        onReorderQuestions?.(renumbered);
      }
    }
  }, [questions, onReorderQuestions]);

  // Effective scale based on zoom mode
  const effectiveScale = zoom === 'auto' ? autoScale : zoom;

  // Paper dimensions in mm
  const getPaperDimensions = () => {
    const isLandscape = settings.paperOrientation === 'landscape';
    
    const dimensions = {
      A4: { width: 210, height: 297 },
      Letter: { width: 216, height: 279 },
      Legal: { width: 216, height: 356 },
      A5: { width: 148, height: 210 },
    };
    
    const size = dimensions[settings.paperSize] || dimensions.A4;
    return isLandscape 
      ? { width: size.height, height: size.width }
      : size;
  };

  // Calculate auto-scale to fit paper in container
  useEffect(() => {
    if (zoom !== 'auto') return;
    
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 48;
      const containerHeight = container.clientHeight - 48;
      
      const paper = getPaperDimensions();
      const paperWidthPx = paper.width * 3.78;
      const paperHeightPx = paper.height * 3.78;
      
      const scaleX = containerWidth / paperWidthPx;
      const scaleY = containerHeight / paperHeightPx;
      
      const newScale = Math.min(scaleX, scaleY, 1);
      setAutoScale(Math.max(0.25, newScale));
    };

    calculateScale();
    
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [settings.paperSize, settings.paperOrientation, zoom]);

  const getPaperSizeClass = () => {
    const isLandscape = settings.paperOrientation === 'landscape';
    
    switch (settings.paperSize) {
      case 'Letter':
        return isLandscape ? 'w-[279mm] min-h-[216mm]' : 'w-[216mm] min-h-[279mm]';
      case 'Legal':
        return isLandscape ? 'w-[356mm] min-h-[216mm]' : 'w-[216mm] min-h-[356mm]';
      case 'A5':
        return isLandscape ? 'w-[210mm] min-h-[148mm]' : 'w-[148mm] min-h-[210mm]';
      case 'A4':
      default:
        return isLandscape ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]';
    }
  };

  const getHeaderStyle = (field: keyof HeaderStyles): ElementStyle => {
    return settings.headerStyles?.[field] || { fontSize: 14, fontFamily: 'SolaimanLipi', textAlign: 'center' };
  };

  const updateHeaderStyle = (field: keyof HeaderStyles, style: ElementStyle) => {
    onSettingsChange({
      ...settings,
      headerStyles: {
        ...settings.headerStyles,
        [field]: style,
      },
    });
  };

  const handleHeaderFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof HeaderStyles
  ) => {
    activeRef.current = e.target;
    setActiveContext({
      type: 'header',
      field,
      currentStyle: getHeaderStyle(field),
    });
    setShowToolbar(true);
  };

  const handleQuestionFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionId: string,
    type: 'question' | 'option' | 'statement',
    index?: number,
    currentStyle?: ElementStyle
  ) => {
    activeRef.current = e.target;
    setActiveContext({
      type,
      questionId,
      optionIndex: type === 'option' ? index : undefined,
      statementIndex: type === 'statement' ? index : undefined,
      currentStyle: currentStyle || { fontSize: settings.fontSize, fontFamily: settings.fontFamily, textAlign: 'left' },
    });
    setShowToolbar(true);
  };

  const handleBlur = useCallback(() => {
    // Clear any existing timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    
    blurTimeoutRef.current = setTimeout(() => {
      // Only hide if not interacting with toolbar
      if (!isToolbarInteracting) {
        setShowToolbar(false);
        setActiveContext(null);
        activeRef.current = null;
      }
    }, 150);
  }, [isToolbarInteracting]);

  const handleToolbarInteractionStart = useCallback(() => {
    setIsToolbarInteracting(true);
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, []);

  const handleToolbarInteractionEnd = useCallback(() => {
    setIsToolbarInteracting(false);
  }, []);

  const handleStyleChange = useCallback((newStyle: ElementStyle) => {
    if (!activeContext) return;

    if (activeContext.type === 'header' && activeContext.field) {
      updateHeaderStyle(activeContext.field, newStyle);
      setActiveContext({ ...activeContext, currentStyle: newStyle });
    } else if (activeContext.questionId) {
      const question = questions.find(q => q.id === activeContext.questionId);
      if (!question) return;

      let updatedQuestion = { ...question };

      if (activeContext.type === 'question') {
        updatedQuestion.questionStyle = newStyle;
      } else if (activeContext.type === 'option' && activeContext.optionIndex !== undefined) {
        const newOptions = [...updatedQuestion.options];
        newOptions[activeContext.optionIndex] = {
          ...newOptions[activeContext.optionIndex],
          style: newStyle,
        };
        updatedQuestion.options = newOptions;
      } else if (activeContext.type === 'statement' && activeContext.statementIndex !== undefined) {
        const newStyles = [...(updatedQuestion.statementStyles || [])];
        newStyles[activeContext.statementIndex] = newStyle;
        updatedQuestion.statementStyles = newStyles;
      }

      onUpdateQuestion(updatedQuestion);
      setActiveContext({ ...activeContext, currentStyle: newStyle });
    }
  }, [activeContext, questions, onUpdateQuestion, settings]);

  // Split questions into columns
  const getColumnedQuestions = () => {
    if (settings.columns === 1) {
      return [questions];
    }
    
    const midpoint = Math.ceil(questions.length / 2);
    return [questions.slice(0, midpoint), questions.slice(midpoint)];
  };

  const columnedQuestions = getColumnedQuestions();

  // Inline editable text component for header
  const HeaderEditable: React.FC<{
    value: string;
    onChange: (value: string) => void;
    field: keyof HeaderStyles;
    as?: 'input' | 'textarea';
    placeholder?: string;
    className?: string;
  }> = ({ value, onChange, field, as = 'input', placeholder, className }) => {
    const style = getHeaderStyle(field);
    const inlineStyle = {
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      textAlign: style.textAlign as React.CSSProperties['textAlign'],
    };

    if (!isEditing) {
      return <span className={className} style={inlineStyle}>{value}</span>;
    }

    const inputClasses = cn(
      'bg-transparent border-0 w-full',
      editableBaseClass,
      editableHoverClass,
      editableFocusClass,
      className
    );

    if (as === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => handleHeaderFocus(e, field)}
          onBlur={handleBlur}
          className={cn(inputClasses, 'resize-none min-h-[3em]')}
          style={inlineStyle}
          placeholder={placeholder}
          rows={2}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => handleHeaderFocus(e, field)}
        onBlur={handleBlur}
        className={inputClasses}
        style={inlineStyle}
        placeholder={placeholder}
      />
    );
  };

  const updateSetting = <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-0 overflow-auto p-6"
    >
      {/* Floating Toolbar */}
      <FloatingToolbar
        targetRef={activeRef}
        isVisible={showToolbar && isEditing && activeContext !== null}
        currentStyle={activeContext?.currentStyle || { fontSize: 14, fontFamily: 'SolaimanLipi', textAlign: 'left' }}
        onStyleChange={handleStyleChange}
        showAlignment={true}
        onInteractionStart={handleToolbarInteractionStart}
        onInteractionEnd={handleToolbarInteractionEnd}
      />

      <div 
        className="flex justify-center"
        style={{ minHeight: zoom === 'auto' ? '100%' : 'auto' }}
      >
        <div
          className="origin-top transition-transform duration-200 shrink-0"
          style={{ transform: `scale(${effectiveScale})` }}
        >
        <div
          ref={paperRef}
          className={cn(
            'bg-white shadow-lg p-8 print:shadow-none print:p-0',
            getPaperSizeClass()
          )}
          style={{ fontFamily: 'SolaimanLipi, sans-serif', lineHeight: settings.lineHeight || 1.1 }}
          id="paper-preview"
        >
        {/* Header */}
        <div className="text-center border-b pb-1">
          <HeaderEditable
            value={settings.institutionName}
            onChange={(v) => updateSetting('institutionName', v)}
            field="institutionName"
            className="font-bold block"
            placeholder="প্রতিষ্ঠানের নাম"
          />

          {settings.showClassName && (
            <HeaderEditable
              value={settings.className}
              onChange={(v) => updateSetting('className', v)}
              field="className"
              className="block text-sm"
              placeholder="শ্রেণি"
            />
          )}

          {settings.showSetCode && (
            <span className="flex items-center justify-center gap-1 text-sm">
              সেট:{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={settings.setCode}
                  onChange={(e) => updateSetting('setCode', e.target.value)}
                  onFocus={(e) => handleHeaderFocus(e, 'setCode')}
                  onBlur={handleBlur}
                  className={cn(
                    'border px-1.5 py-0 font-bold w-8 text-center bg-transparent',
                    editableBaseClass,
                    editableHoverClass,
                    editableFocusClass
                  )}
                  style={{
                    fontSize: getHeaderStyle('setCode').fontSize,
                    fontFamily: getHeaderStyle('setCode').fontFamily,
                  }}
                />
              ) : (
                <span 
                  className="border px-1.5 font-bold"
                  style={{
                    fontSize: getHeaderStyle('setCode').fontSize,
                    fontFamily: getHeaderStyle('setCode').fontFamily,
                  }}
                >
                  {settings.setCode}
                </span>
              )}
            </span>
          )}

          {settings.showSubjectName && (
            <HeaderEditable
              value={settings.subjectName}
              onChange={(v) => updateSetting('subjectName', v)}
              field="subjectName"
              className="font-medium block text-sm"
              placeholder="বিষয়ের নাম"
            />
          )}
          
          {settings.showChapterName && (
            <HeaderEditable
              value={settings.chapterName}
              onChange={(v) => updateSetting('chapterName', v)}
              field="chapterName"
              className="block text-sm text-muted-foreground"
              placeholder="অধ্যায়ের নাম"
            />
          )}
        </div>

        {/* Time & Marks - Styled row */}
        {(settings.showTime || settings.showTotalMarks) && (
          <div className="flex justify-between items-center text-sm py-1 border-b">
            {settings.showTime ? (
              <span 
                className="flex items-center"
                style={{
                  fontSize: getHeaderStyle('time').fontSize,
                  fontFamily: getHeaderStyle('time').fontFamily,
                }}
              >
                সময়:{' '}
                <HeaderEditable
                  value={settings.time}
                  onChange={(v) => updateSetting('time', v)}
                  field="time"
                  className="inline-block font-medium"
                  placeholder="সময়"
                />
              </span>
            ) : <span />}
            {settings.showTotalMarks ? (
              <span 
                className="flex items-center"
                style={{
                  fontSize: getHeaderStyle('totalMarks').fontSize,
                  fontFamily: getHeaderStyle('totalMarks').fontFamily,
                }}
              >
                পূর্ণমান:{' '}
                {isEditing ? (
                  <input
                    type="number"
                    value={settings.totalMarks}
                    onChange={(e) => updateSetting('totalMarks', parseInt(e.target.value) || 0)}
                    onFocus={(e) => handleHeaderFocus(e, 'totalMarks')}
                    onBlur={handleBlur}
                    className={cn(
                      'bg-transparent border-0 w-10 font-medium',
                      editableBaseClass,
                      editableHoverClass,
                      editableFocusClass
                    )}
                  />
                ) : (
                  <span className="font-medium">{settings.totalMarks}</span>
                )}
              </span>
            ) : <span />}
          </div>
        )}

        {/* Instructions */}
        {settings.showInstructions && (
          <div className="text-muted-foreground py-1 text-sm">
            <HeaderEditable
              value={settings.instructions}
              onChange={(v) => updateSetting('instructions', v)}
              field="instructions"
              as="textarea"
              className="w-full"
              placeholder="নির্দেশনা লিখুন..."
            />
          </div>
        )}

        {settings.showNoMarkingNote && (
          <p className="text-center text-sm py-1 font-medium border-t">
            প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
          </p>
        )}

        {/* Questions with DnD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{
                columnCount: settings.columns,
                columnGap: '1.5rem',
                columnRule: settings.showColumnDivider ? '1px solid hsl(var(--border))' : 'none',
              }}
            >
              {questions.map((question) => (
                <div key={question.id} style={{ breakInside: 'avoid' }}>
                  <EditableQuestion
                    question={question}
                    settings={settings}
                    onUpdate={onUpdateQuestion}
                    onDelete={onDeleteQuestion}
                    onDuplicate={onDuplicateQuestion}
                    isEditing={isEditing}
                    isDraggable={isEditing && !!onReorderQuestions && settings.columns === 1}
                    onFocus={(e, type, index, style) => handleQuestionFocus(e, question.id, type, index, style)}
                    onBlur={handleBlur}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Watermark */}
        {settings.showWatermark && settings.watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-6xl font-bold rotate-[-30deg]">
            {settings.watermark}
          </div>
        )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default PaperPreview;
