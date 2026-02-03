// Exam scheduling utilities for conflict detection and validation

import { format, parseISO, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

export interface ExamSchedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  batchId?: string;
  batchName?: string;
  subjectId?: string;
  subjectName?: string;
}

export interface ScheduleConflict {
  type: 'batch' | 'teacher' | 'time_overlap' | 'same_day_subject';
  severity: 'warning' | 'error';
  message: string;
  conflictingExam?: ExamSchedule;
}

export interface TimeSlot {
  label: string;
  value: string;
}

// Generate time slots in 30-minute intervals
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const label = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      slots.push({ label, value: time });
    }
  }
  return slots;
};

// Check for scheduling conflicts
export const detectConflicts = (
  newExam: {
    startDate: Date;
    endDate: Date;
    batchIds: string[];
    subjectId?: string;
  },
  existingExams: ExamSchedule[]
): ScheduleConflict[] => {
  const conflicts: ScheduleConflict[] = [];

  for (const exam of existingExams) {
    const existingStart = parseISO(exam.startDate);
    const existingEnd = parseISO(exam.endDate);

    // Check time overlap
    const hasTimeOverlap = areIntervalsOverlapping(
      { start: newExam.startDate, end: newExam.endDate },
      { start: existingStart, end: existingEnd }
    );

    if (hasTimeOverlap) {
      // Check batch conflict
      if (exam.batchId && newExam.batchIds.includes(exam.batchId)) {
        conflicts.push({
          type: 'batch',
          severity: 'error',
          message: `Batch "${exam.batchName}" already has "${exam.title}" scheduled at this time`,
          conflictingExam: exam,
        });
      }

      // Check same subject on same day
      if (exam.subjectId && exam.subjectId === newExam.subjectId) {
        const sameDay = format(newExam.startDate, 'yyyy-MM-dd') === format(existingStart, 'yyyy-MM-dd');
        if (sameDay) {
          conflicts.push({
            type: 'same_day_subject',
            severity: 'warning',
            message: `Subject "${exam.subjectName}" already has an exam on this day`,
            conflictingExam: exam,
          });
        }
      }
    }
  }

  return conflicts;
};

// Exam types with descriptions
export const examTypes = [
  { value: 'WEEKLY', label: 'Weekly Test', description: 'Regular weekly assessment', icon: 'calendar-days' },
  { value: 'MONTHLY', label: 'Monthly Exam', description: 'End of month evaluation', icon: 'calendar-range' },
  { value: 'TERM', label: 'Term Exam', description: 'Semester/term examination', icon: 'graduation-cap' },
  { value: 'MOCK', label: 'Mock Test', description: 'Practice for main exams', icon: 'clipboard-check' },
  { value: 'PRACTICE', label: 'Practice Quiz', description: 'Self-paced practice', icon: 'book-open' },
] as const;

// Duration presets
export const durationPresets = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
] as const;

// Validate exam scheduling
export const validateExamSchedule = (data: {
  title: string;
  type: string;
  batchIds: string[];
  subjectId?: string;
  startDate?: Date;
  startTime?: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Exam title is required';
  }

  if (!data.type) {
    errors.type = 'Please select an exam type';
  }

  if (data.batchIds.length === 0) {
    errors.batchIds = 'Select at least one batch';
  }

  if (!data.startDate) {
    errors.startDate = 'Please select a date';
  }

  if (!data.startTime) {
    errors.startTime = 'Please select a start time';
  }

  if (data.duration < 10) {
    errors.duration = 'Duration must be at least 10 minutes';
  }

  if (data.totalMarks <= 0) {
    errors.totalMarks = 'Total marks must be greater than 0';
  }

  if (data.passingMarks > data.totalMarks) {
    errors.passingMarks = 'Passing marks cannot exceed total marks';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
