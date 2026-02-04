import React from 'react';
import { cn } from '@/lib/utils';
import { PaperQuestion, PaperSettings, PaperMetadata } from './types';
import EditableQuestion from './EditableQuestion';

interface PaperPreviewProps {
  questions: PaperQuestion[];
  settings: PaperSettings;
  metadata: PaperMetadata;
  onUpdateQuestion: (question: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: PaperQuestion) => void;
  isEditing: boolean;
}

const PaperPreview: React.FC<PaperPreviewProps> = ({
  questions,
  settings,
  metadata,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  isEditing,
}) => {
  const getPaperSizeClass = () => {
    switch (settings.paperSize) {
      case 'Letter':
        return 'w-[216mm] min-h-[279mm]';
      case 'Legal':
        return 'w-[216mm] min-h-[356mm]';
      case 'A5':
        return 'w-[148mm] min-h-[210mm]';
      case 'A4':
      default:
        return 'w-[210mm] min-h-[297mm]';
    }
  };

  const getTextAlignClass = () => {
    switch (settings.textAlign) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return 'text-left';
    }
  };

  // Split questions into columns
  const getColumnedQuestions = () => {
    if (settings.columns === 1) {
      return [questions];
    }
    
    const midpoint = Math.ceil(questions.length / 2);
    return [questions.slice(0, midpoint), questions.slice(midpoint)];
  };

  const columnedQuestions = getColumnedQuestions();

  return (
    <div
      className={cn(
        'bg-white shadow-lg mx-auto p-8 print:shadow-none print:p-0',
        getPaperSizeClass()
      )}
      style={{ fontFamily: settings.fontFamily === 'Bangla' ? 'SolaimanLipi, sans-serif' : 'inherit' }}
      id="paper-preview"
    >
      {/* Header */}
      <div className="text-center mb-4 border-b pb-4">
        {isEditing ? (
          <input
            type="text"
            value={settings.institutionName}
            className="text-xl font-bold text-center w-full bg-transparent border-0 border-b border-transparent hover:border-primary/30 focus:border-primary focus:outline-none"
            readOnly
          />
        ) : (
          <h1 className="text-xl font-bold">{settings.institutionName}</h1>
        )}

        <div className="flex items-center justify-center gap-4 mt-2 text-sm">
          {settings.showClassName && <span>{metadata.className}</span>}
          {settings.showSetCode && (
            <span className="flex items-center gap-1">
              সেট:{' '}
              <span className="border px-2 py-0.5 font-bold">{settings.setCode}</span>
            </span>
          )}
        </div>

        {settings.showSubjectName && (
          <p className="mt-1 font-medium">{metadata.subjectName}</p>
        )}
        {settings.showChapterName && (
          <p className="text-sm text-muted-foreground">{metadata.chapterName}</p>
        )}
      </div>

      {/* Time & Marks */}
      <div className="flex justify-between text-sm mb-4">
        {settings.showTime && <span>সময়— {settings.time}</span>}
        {settings.showTotalMarks && (
          <span>পূর্ণমান— {settings.totalMarks}</span>
        )}
      </div>

      {/* Instructions */}
      {settings.showInstructions && settings.instructions && (
        <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted/30 rounded">
          {settings.instructions}
        </div>
      )}

      <p className="text-center text-sm mb-4 font-medium">
        প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
      </p>

      {/* Questions */}
      <div
        className={cn(
          'gap-8',
          settings.columns === 2 ? 'grid grid-cols-2' : '',
          settings.columns === 3 ? 'grid grid-cols-3' : '',
          settings.showColumnDivider && settings.columns > 1 && 'divide-x'
        )}
      >
        {columnedQuestions.map((columnQuestions, colIdx) => (
          <div key={colIdx} className={cn(colIdx > 0 && 'pl-4', getTextAlignClass())}>
            {columnQuestions.map((question) => (
              <EditableQuestion
                key={question.id}
                question={question}
                settings={settings}
                onUpdate={onUpdateQuestion}
                onDelete={onDeleteQuestion}
                onDuplicate={onDuplicateQuestion}
                isEditing={isEditing}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Watermark */}
      {settings.showWatermark && settings.watermark && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-10 text-6xl font-bold rotate-[-30deg]">
          {settings.watermark}
        </div>
      )}
    </div>
  );
};

export default PaperPreview;
