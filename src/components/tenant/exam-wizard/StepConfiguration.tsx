import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface StepConfigurationProps {
  data: {
    totalMarks: number;
    passingMarks: number;
    mcqCount: number;
    cqCount: number;
    hasNegativeMark: boolean;
    negativeMark: number;
    shuffleQuestions: boolean;
    showResults: boolean;
    allowReview: boolean;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: number | boolean) => void;
}

const StepConfiguration: React.FC<StepConfigurationProps> = ({
  data,
  errors,
  onChange,
}) => {
  const passingPercentage =
    data.totalMarks > 0
      ? Math.round((data.passingMarks / data.totalMarks) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Exam Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Set marks, question counts, and exam settings
        </p>
      </div>

      {/* Marks Configuration */}
      <div className="p-4 rounded-lg border space-y-4">
        <h3 className="font-medium">Marks Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalMarks">
              Total Marks <span className="text-destructive">*</span>
            </Label>
            <Input
              id="totalMarks"
              type="number"
              min="1"
              value={data.totalMarks}
              onChange={(e) => onChange('totalMarks', parseInt(e.target.value) || 0)}
              className={cn(errors.totalMarks && 'border-destructive')}
            />
            {errors.totalMarks && (
              <p className="text-sm text-destructive">{errors.totalMarks}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passingMarks">
              Passing Marks <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="passingMarks"
                type="number"
                min="0"
                max={data.totalMarks}
                value={data.passingMarks}
                onChange={(e) => onChange('passingMarks', parseInt(e.target.value) || 0)}
                className={cn(errors.passingMarks && 'border-destructive')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ({passingPercentage}%)
              </span>
            </div>
            {errors.passingMarks && (
              <p className="text-sm text-destructive">{errors.passingMarks}</p>
            )}
          </div>
        </div>
      </div>

      {/* Question Counts */}
      <div className="p-4 rounded-lg border space-y-4">
        <h3 className="font-medium">Question Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mcqCount">MCQ Questions</Label>
            <Input
              id="mcqCount"
              type="number"
              min="0"
              value={data.mcqCount}
              onChange={(e) => onChange('mcqCount', parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Multiple choice questions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cqCount">CQ Questions</Label>
            <Input
              id="cqCount"
              type="number"
              min="0"
              value={data.cqCount}
              onChange={(e) => onChange('cqCount', parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Creative/written questions
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm">
            <span className="text-muted-foreground">Total Questions: </span>
            <span className="font-medium">{data.mcqCount + data.cqCount}</span>
          </p>
        </div>
      </div>

      {/* Negative Marking */}
      <div className="p-4 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Negative Marking</h3>
            <p className="text-sm text-muted-foreground">
              Deduct marks for wrong answers
            </p>
          </div>
          <Switch
            checked={data.hasNegativeMark}
            onCheckedChange={(checked) => onChange('hasNegativeMark', checked)}
          />
        </div>

        {data.hasNegativeMark && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="negativeMark">Negative Mark per Wrong Answer</Label>
            <div className="flex items-center gap-2">
              <span className="text-destructive font-medium">-</span>
              <Input
                id="negativeMark"
                type="number"
                min="0"
                step="0.25"
                max="5"
                value={data.negativeMark}
                onChange={(e) => onChange('negativeMark', parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">marks</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Common values: 0.25, 0.33, 0.5, 1.0
            </p>
          </div>
        )}
      </div>

      {/* Exam Settings */}
      <div className="p-4 rounded-lg border space-y-4">
        <h3 className="font-medium">Exam Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Shuffle Questions</p>
              <p className="text-xs text-muted-foreground">
                Randomize question order for each student
              </p>
            </div>
            <Switch
              checked={data.shuffleQuestions}
              onCheckedChange={(checked) => onChange('shuffleQuestions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show Results Immediately</p>
              <p className="text-xs text-muted-foreground">
                Display score after submission
              </p>
            </div>
            <Switch
              checked={data.showResults}
              onCheckedChange={(checked) => onChange('showResults', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Allow Review</p>
              <p className="text-xs text-muted-foreground">
                Let students review answers after exam
              </p>
            </div>
            <Switch
              checked={data.allowReview}
              onCheckedChange={(checked) => onChange('allowReview', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepConfiguration;
