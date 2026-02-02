import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Sparkles, Users, FileText, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Dashboard! 🎉',
    description: 'This is your command center for managing your academy. Let\'s take a quick tour to get you started.',
    icon: Sparkles,
  },
  {
    id: 'students',
    title: 'Manage Students',
    description: 'Add, edit, and track all your students. View their performance, attendance, and batch assignments in one place.',
    icon: Users,
    highlight: '/tenant/students',
  },
  {
    id: 'exams',
    title: 'Create & Manage Exams',
    description: 'Create exams, set schedules, and publish them to your students. Track submissions and review results easily.',
    icon: FileText,
    highlight: '/tenant/exams',
  },
  {
    id: 'analytics',
    title: 'Track Performance',
    description: 'Get insights into student performance, attendance trends, and exam statistics with detailed analytics.',
    icon: BarChart3,
    highlight: '/tenant/analytics',
  },
  {
    id: 'settings',
    title: 'Customize Your Academy',
    description: 'Configure your academy settings, branding, and preferences to make it truly yours.',
    icon: Settings,
    highlight: '/tenant/settings',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  isOpen: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsAnimating(false);
    }, 150);
  };

  const handlePrev = () => {
    if (currentStep === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 150);
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Tour Card */}
      <Card className={cn(
        "relative w-full max-w-md shadow-2xl border-2 transition-all duration-300",
        isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      )}>
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="pt-8 pb-6 px-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Step indicator dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentStep
                    ? "bg-primary w-6"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex-1 text-muted-foreground"
              >
                Skip Tour
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {isLastStep ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTour;
