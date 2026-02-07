import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, GraduationCap, Heart, MapPin, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 1, title: 'Basic Info', description: 'Name & Contact', icon: <User className="w-5 h-5" /> },
  { id: 2, title: 'Academic', description: 'Class & Batch', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 3, title: 'Personal', description: 'Family & Details', icon: <Heart className="w-5 h-5" /> },
  { id: 4, title: 'Address', description: 'Location Info', icon: <MapPin className="w-5 h-5" /> },
  { id: 5, title: 'Review', description: 'Confirm & Submit', icon: <ClipboardCheck className="w-5 h-5" /> },
];

interface WizardStepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps: number[];
}

const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  return (
    <div className="w-full">
      {/* Desktop horizontal stepper */}
      <div className="hidden lg:flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-muted" />
        
        {/* Progress line fill */}
        <motion.div
          className="absolute left-0 top-6 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || step.id <= Math.max(...completedSteps, currentStep);

          return (
            <div
              key={step.id}
              className={cn(
                'relative z-10 flex flex-col items-center cursor-pointer group',
                !isClickable && 'cursor-not-allowed'
              )}
              onClick={() => isClickable && onStepClick?.(step.id)}
            >
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-background border-primary text-primary shadow-lg shadow-primary/20'
                    : 'bg-background border-muted text-muted-foreground'
                )}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step.icon
                )}
              </motion.div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden xl:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile compact stepper */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {steps[currentStep - 1].icon}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Step {currentStep} of {steps.length}
              </p>
              <p className="text-xs text-muted-foreground">{steps[currentStep - 1].title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {Math.round((currentStep / steps.length) * 100)}%
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Step pills */}
        <div className="flex justify-center gap-1.5 mt-4">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;

            return (
              <motion.button
                key={step.id}
                className={cn(
                  'w-8 h-1.5 rounded-full transition-all',
                  isCompleted
                    ? 'bg-primary'
                    : isCurrent
                    ? 'bg-primary/60 w-12'
                    : 'bg-muted'
                )}
                whileTap={{ scale: 0.9 }}
                onClick={() => (isCompleted || isCurrent) && onStepClick?.(step.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WizardStepIndicator;
