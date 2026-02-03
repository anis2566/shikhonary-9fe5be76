import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { addHours, setHours, setMinutes } from 'date-fns';

import WizardProgress from './WizardProgress';
import StepBasicInfo from './StepBasicInfo';
import StepBatchSelection from './StepBatchSelection';
import StepSubjectPicker from './StepSubjectPicker';
import StepScheduling from './StepScheduling';
import StepConfiguration from './StepConfiguration';
import StepQuestionSelection from './StepQuestionSelection';
import StepReview from './StepReview';
import {
  detectConflicts,
  ScheduleConflict,
} from '@/lib/exam-scheduling-utils';
import { mockExams } from '@/lib/tenant-mock-data';

interface SelectedQuestion {
  id: string;
  type: 'mcq' | 'cq';
}

interface ExamFormData {
  title: string;
  description: string;
  type: string;
  batchIds: string[];
  subjectId: string;
  chapterIds: string[];
  selectedQuestions: SelectedQuestion[];
  startDate?: Date;
  startTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  mcqCount: number;
  cqCount: number;
  hasNegativeMark: boolean;
  negativeMark: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  allowReview: boolean;
}

const steps = [
  { id: 1, title: 'Basic Info', description: 'Title & type' },
  { id: 2, title: 'Batches', description: 'Select groups' },
  { id: 3, title: 'Subject', description: 'Pick subject' },
  { id: 4, title: 'Questions', description: 'Select questions' },
  { id: 5, title: 'Schedule', description: 'Date & time' },
  { id: 6, title: 'Configure', description: 'Marks & settings' },
  { id: 7, title: 'Review', description: 'Confirm details' },
];

const initialFormData: ExamFormData = {
  title: '',
  description: '',
  type: '',
  batchIds: [],
  subjectId: '',
  chapterIds: [],
  selectedQuestions: [],
  startDate: undefined,
  startTime: '',
  duration: 60,
  totalMarks: 100,
  passingMarks: 40,
  mcqCount: 0,
  cqCount: 0,
  hasNegativeMark: false,
  negativeMark: 0.25,
  shuffleQuestions: true,
  showResults: true,
  allowReview: false,
};

const ExamSchedulingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExamFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate conflicts
  const conflicts = useMemo<ScheduleConflict[]>(() => {
    if (!formData.startDate || !formData.startTime || formData.batchIds.length === 0) {
      return [];
    }

    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const startDate = setMinutes(setHours(formData.startDate, hours), minutes);
    const endDate = addHours(startDate, formData.duration / 60);

    // Convert existing exams to schedule format
    const existingSchedules = mockExams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      startDate: exam.startDate,
      endDate: exam.endDate,
      batchId: exam.batchId,
      batchName: exam.batchName,
    }));

    return detectConflicts(
      {
        startDate,
        endDate,
        batchIds: formData.batchIds,
        subjectId: formData.subjectId,
      },
      existingSchedules
    );
  }, [formData.startDate, formData.startTime, formData.duration, formData.batchIds, formData.subjectId]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Exam title is required';
        if (!formData.type) newErrors.type = 'Please select an exam type';
        break;
      case 2:
        if (formData.batchIds.length === 0)
          newErrors.batchIds = 'Select at least one batch';
        break;
      case 3:
        // Subject is optional
        break;
      case 4:
        // Questions selection - optional but show warning
        break;
      case 5:
        if (!formData.startDate) newErrors.startDate = 'Please select a date';
        if (!formData.startTime) newErrors.startTime = 'Please select a start time';
        if (formData.duration < 10) newErrors.duration = 'Duration must be at least 10 minutes';
        break;
      case 6:
        if (formData.totalMarks <= 0) newErrors.totalMarks = 'Total marks must be greater than 0';
        if (formData.passingMarks > formData.totalMarks)
          newErrors.passingMarks = 'Passing marks cannot exceed total marks';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGoToStep = (step: number) => {
    // Only allow going to completed steps or current step
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    // Validate required steps
    const requiredSteps = [1, 2, 5, 6];
    for (const step of requiredSteps) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        toast.error(`Please complete step ${step} correctly`);
        return;
      }
    }

    // Check for blocking conflicts
    const blockingConflicts = conflicts.filter((c) => c.severity === 'error');
    if (blockingConflicts.length > 0) {
      toast.error('Please resolve scheduling conflicts before creating the exam');
      setCurrentStep(5);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Exam created successfully!', {
        description: `${formData.selectedQuestions.length} questions added to the exam.`,
      });

      navigate('/tenant/exams');
    } catch (error) {
      toast.error('Failed to create exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      formData.title ||
      formData.batchIds.length > 0 ||
      formData.startDate ||
      formData.selectedQuestions.length > 0
    ) {
      if (window.confirm('Are you sure you want to discard this exam?')) {
        navigate('/tenant/exams');
      }
    } else {
      navigate('/tenant/exams');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            data={formData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <StepBatchSelection
            data={formData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <StepSubjectPicker
            data={formData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <StepQuestionSelection
            data={formData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 5:
        return (
          <StepScheduling
            data={formData}
            conflicts={conflicts}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 6:
        return (
          <StepConfiguration
            data={formData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 7:
        return <StepReview data={formData} onEditStep={handleGoToStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Create New Exam</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Schedule an examination for your students
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <WizardProgress
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-4 sm:p-6">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Exam
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSchedulingWizard;
