import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Loader2,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  WizardStepIndicator,
  StepBasicInfo,
  StepAcademicInfo,
  StepPersonalDetails,
  StepAddress,
  StepReview,
} from '@/components/tenant/student-wizard';
import {
  StudentFormData,
  defaultStudentFormValues,
  basicInfoSchema,
  academicInfoSchema,
  personalDetailsSchema,
  addressInfoSchema,
  studentFormSchema,
} from '@/lib/validations/student';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const TOTAL_STEPS = 5;

const stepSchemas = [
  basicInfoSchema,
  academicInfoSchema,
  personalDetailsSchema,
  addressInfoSchema,
  studentFormSchema, // Full schema for final validation
];

const StudentCreate: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [direction, setDirection] = useState(1);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: defaultStudentFormValues,
    mode: 'onChange',
  });

  const validateCurrentStep = useCallback(async () => {
    const schema = stepSchemas[currentStep - 1];
    const data = form.getValues();

    try {
      await schema.parseAsync(data);
      return true;
    } catch {
      // Trigger form validation to show errors
      const fields = Object.keys(schema.shape || {}) as (keyof StudentFormData)[];
      await form.trigger(fields);
      return false;
    }
  }, [currentStep, form]);

  const goToNextStep = useCallback(async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      
      if (currentStep < TOTAL_STEPS) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  }, [currentStep, completedSteps, validateCurrentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step <= Math.max(...completedSteps, currentStep) && step >= 1 && step <= TOTAL_STEPS) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    }
  }, [completedSteps, currentStep]);

  const handleSubmit = useCallback(async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error('Please check all fields before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const data = form.getValues();
      console.log('Student created:', data);
      
      toast.success('Student created successfully!', {
        description: `${data.name} has been added to the system.`,
      });
      
      navigate('/tenant/students');
    } catch (error) {
      toast.error('Failed to create student', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, navigate]);

  const handleExit = useCallback(() => {
    const isDirty = form.formState.isDirty;
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      navigate('/tenant/students');
    }
  }, [form.formState.isDirty, navigate]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo form={form} />;
      case 2:
        return <StepAcademicInfo form={form} />;
      case 3:
        return <StepPersonalDetails form={form} />;
      case 4:
        return <StepAddress form={form} />;
      case 5:
        return <StepReview form={form} onEditStep={goToStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="p-4 lg:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Students</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExit}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                <UserPlus className="w-6 h-6" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Add New Student
              </h1>
            </div>
            <p className="text-muted-foreground">
              Complete the form below to register a new student
            </p>
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <WizardStepIndicator
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={goToStep}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-4 lg:p-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            'mt-6 flex gap-3',
            isMobile
              ? 'fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50'
              : 'justify-between'
          )}
        >
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className={cn(isMobile ? 'flex-1' : '')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={goToNextStep} className={cn(isMobile ? 'flex-1' : '')}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'bg-gradient-to-r from-primary to-primary/90',
                isMobile ? 'flex-1' : ''
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Student
                </>
              )}
            </Button>
          )}
        </motion.div>

        {/* Spacer for mobile fixed button */}
        {isMobile && <div className="h-20" />}
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? All entered data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate('/tenant/students')}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentCreate;
