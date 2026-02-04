import React from 'react';
import { cn } from '@/lib/utils';
import { PaperQuestion, PaperSettings } from './types';
import EditableQuestion from './EditableQuestion';

interface PaperPreviewProps {
  questions: PaperQuestion[];
  settings: PaperSettings;
  onUpdateQuestion: (question: PaperQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: PaperQuestion) => void;
  onSettingsChange: (settings: PaperSettings) => void;
  isEditing: boolean;
}

const PaperPreview: React.FC<PaperPreviewProps> = ({
  questions,
  settings,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onSettingsChange,
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

  const updateSetting = <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
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

  const EditableField: React.FC<{
    value: string;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
  }> = ({ value, onChange, className, multiline }) => {
    if (!isEditing) {
      return <span className={className}>{value}</span>;
    }

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'bg-transparent border-0 border-b border-dashed border-transparent hover:border-primary/50 focus:border-primary focus:outline-none resize-none w-full',
            className
          )}
          rows={2}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-transparent border-0 border-b border-dashed border-transparent hover:border-primary/50 focus:border-primary focus:outline-none text-center w-full',
          className
        )}
      />
    );
  };

  const EditableNumber: React.FC<{
    value: number;
    onChange: (value: number) => void;
    className?: string;
  }> = ({ value, onChange, className }) => {
    if (!isEditing) {
      return <span className={className}>{value}</span>;
    }

    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className={cn(
          'bg-transparent border-0 border-b border-dashed border-transparent hover:border-primary/50 focus:border-primary focus:outline-none w-16 text-center',
          className
        )}
      />
    );
  };

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
        <EditableField
          value={settings.institutionName}
          onChange={(v) => updateSetting('institutionName', v)}
          className="text-xl font-bold block"
        />

        <div className="flex items-center justify-center gap-4 mt-2 text-sm flex-wrap">
          {settings.showClassName && (
            <EditableField
              value={settings.className}
              onChange={(v) => updateSetting('className', v)}
              className="inline-block"
            />
          )}
          {settings.showSetCode && (
            <span className="flex items-center gap-1">
              সেট:{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={settings.setCode}
                  onChange={(e) => updateSetting('setCode', e.target.value)}
                  className="border px-2 py-0.5 font-bold w-10 text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <span className="border px-2 py-0.5 font-bold">{settings.setCode}</span>
              )}
            </span>
          )}
        </div>

        {settings.showSubjectName && (
          <div className="mt-1">
            <EditableField
              value={settings.subjectName}
              onChange={(v) => updateSetting('subjectName', v)}
              className="font-medium inline-block"
            />
          </div>
        )}
        {settings.showChapterName && (
          <div className="text-sm text-muted-foreground">
            <EditableField
              value={settings.chapterName}
              onChange={(v) => updateSetting('chapterName', v)}
              className="inline-block"
            />
          </div>
        )}
      </div>

      {/* Time & Marks */}
      <div className="flex justify-between text-sm mb-4">
        {settings.showTime && (
          <span className="flex items-center gap-1">
            সময়—{' '}
            <EditableField
              value={settings.time}
              onChange={(v) => updateSetting('time', v)}
              className="inline-block"
            />
          </span>
        )}
        {settings.showTotalMarks && (
          <span className="flex items-center gap-1">
            পূর্ণমান—{' '}
            <EditableNumber
              value={settings.totalMarks}
              onChange={(v) => updateSetting('totalMarks', v)}
            />
          </span>
        )}
      </div>

      {/* Instructions */}
      {settings.showInstructions && (
        <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted/30 rounded">
          <EditableField
            value={settings.instructions}
            onChange={(v) => updateSetting('instructions', v)}
            multiline
            className="w-full"
          />
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
