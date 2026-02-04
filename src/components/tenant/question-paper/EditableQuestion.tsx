import React, { useState } from 'react';
import { GripVertical, Trash2, Copy, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaperQuestion, PaperSettings, ElementStyle } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface EditableQuestionProps {
  question: PaperQuestion;
  settings: PaperSettings;
  onUpdate: (question: PaperQuestion) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: PaperQuestion) => void;
  isEditing: boolean;
  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'question' | 'option' | 'statement',
    index?: number,
    currentStyle?: ElementStyle
  ) => void;
  onBlur?: () => void;
}

// Inline editable styles
const editableBaseClass = 'transition-all duration-200 rounded px-1 -mx-1';
const editableHoverClass = 'hover:bg-primary/10 hover:ring-1 hover:ring-primary/30';
const editableFocusClass = 'focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none';

const EditableQuestion: React.FC<EditableQuestionProps> = ({
  question,
  settings,
  onUpdate,
  onDelete,
  onDuplicate,
  isEditing,
  onFocus,
  onBlur,
}) => {
  const [localQuestion, setLocalQuestion] = useState(question);

  // Sync local state when question prop changes
  React.useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const getQuestionStyle = (): ElementStyle => {
    return localQuestion.questionStyle || { 
      fontSize: settings.fontSize, 
      fontFamily: settings.fontFamily, 
      textAlign: 'left' 
    };
  };

  const getOptionStyle = (index: number): ElementStyle => {
    return localQuestion.options[index]?.style || { 
      fontSize: settings.fontSize, 
      fontFamily: settings.fontFamily, 
      textAlign: 'left' 
    };
  };

  const getStatementStyle = (index: number): ElementStyle => {
    return localQuestion.statementStyles?.[index] || { 
      fontSize: settings.fontSize - 1, 
      fontFamily: settings.fontFamily, 
      textAlign: 'left' 
    };
  };

  const handleQuestionChange = (value: string) => {
    const updated = { ...localQuestion, question: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...localQuestion.options];
    newOptions[index] = { ...newOptions[index], text: value };
    const updated = { ...localQuestion, options: newOptions };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const renderOptionLabel = (label: string) => {
    switch (settings.optionStyle) {
      case 'dot':
        return <span className="shrink-0 text-muted-foreground">{label}.</span>;
      case 'bracket':
        return <span className="shrink-0 text-muted-foreground">{label})</span>;
      case 'round':
        return (
          <span className="shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-medium">
            {label}
          </span>
        );
      case 'parentheses':
      default:
        return <span className="shrink-0 text-muted-foreground">({label})</span>;
    }
  };

  const getBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .split('')
      .map((digit) => bengaliDigits[parseInt(digit)])
      .join('');
  };

  const questionStyle = getQuestionStyle();

  return (
    <div
      className={cn(
        'group relative py-1 transition-all',
        isEditing && 'hover:bg-muted/30 rounded-lg px-2'
      )}
    >
      {isEditing && (
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
        </div>
      )}

      {isEditing && (
        <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border shadow-md z-50">
              <DropdownMenuItem onClick={() => onDuplicate(question)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(question.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex gap-2">
        <span 
          className="font-medium shrink-0" 
          style={{ 
            fontSize: questionStyle.fontSize,
            fontFamily: questionStyle.fontFamily,
          }}
        >
          {getBengaliNumber(question.number)}।
        </span>
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={localQuestion.question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              onFocus={(e) => onFocus?.(e, 'question', undefined, questionStyle)}
              onBlur={onBlur}
              className={cn(
                'w-full bg-transparent border-0 resize-none',
                editableBaseClass,
                editableHoverClass,
                editableFocusClass
              )}
              style={{ 
                fontSize: questionStyle.fontSize,
                fontFamily: questionStyle.fontFamily,
                textAlign: questionStyle.textAlign as React.CSSProperties['textAlign'],
              }}
              rows={Math.ceil(localQuestion.question.length / 50) || 1}
              placeholder="প্রশ্ন লিখুন..."
            />
          ) : (
            <p style={{ 
              fontSize: questionStyle.fontSize,
              fontFamily: questionStyle.fontFamily,
              textAlign: questionStyle.textAlign as React.CSSProperties['textAlign'],
            }}>
              {localQuestion.question}
            </p>
          )}

          {/* Statements if present */}
          {question.statements && question.statements.length > 0 && (
            <div className="mt-1 pl-4 space-y-0">
              {question.statements.map((statement, idx) => {
                const statementStyle = getStatementStyle(idx);
                return (
                  <div 
                    key={idx} 
                    className="flex gap-2" 
                    style={{ 
                      fontSize: statementStyle.fontSize,
                      fontFamily: statementStyle.fontFamily,
                    }}
                  >
                    <span className="text-muted-foreground shrink-0">
                      {['i', 'ii', 'iii', 'iv'][idx]}.
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={statement}
                        onChange={(e) => {
                          const newStatements = [...(localQuestion.statements || [])];
                          newStatements[idx] = e.target.value;
                          const updated = { ...localQuestion, statements: newStatements };
                          setLocalQuestion(updated);
                          onUpdate(updated);
                        }}
                        onFocus={(e) => onFocus?.(e, 'statement', idx, statementStyle)}
                        onBlur={onBlur}
                        className={cn(
                          'flex-1 bg-transparent border-0',
                          editableBaseClass,
                          editableHoverClass,
                          editableFocusClass
                        )}
                        style={{
                          textAlign: statementStyle.textAlign as React.CSSProperties['textAlign'],
                        }}
                        placeholder="বিবৃতি লিখুন..."
                      />
                    ) : (
                      <span style={{
                        textAlign: statementStyle.textAlign as React.CSSProperties['textAlign'],
                      }}>
                        {statement}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Options Grid */}
          <div
            className={cn(
              'mt-1 gap-x-4 gap-y-0',
              settings.columns === 1 ? 'flex flex-col' : 'grid grid-cols-2'
            )}
          >
            {localQuestion.options.map((option, idx) => {
              const optionStyle = getOptionStyle(idx);
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-2',
                    settings.optionStyle === 'round' && 'gap-2'
                  )}
                  style={{ 
                    fontSize: optionStyle.fontSize,
                    fontFamily: optionStyle.fontFamily,
                  }}
                >
                  {renderOptionLabel(option.label)}
                  {isEditing ? (
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      onFocus={(e) => onFocus?.(e, 'option', idx, optionStyle)}
                      onBlur={onBlur}
                      className={cn(
                        'flex-1 bg-transparent border-0 min-w-0',
                        editableBaseClass,
                        editableHoverClass,
                        editableFocusClass
                      )}
                      style={{
                        textAlign: optionStyle.textAlign as React.CSSProperties['textAlign'],
                      }}
                      placeholder="অপশন লিখুন..."
                    />
                  ) : (
                    <span style={{
                      textAlign: optionStyle.textAlign as React.CSSProperties['textAlign'],
                    }}>
                      {option.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableQuestion;
