import { z } from 'zod';

// Base schemas for common fields
const baseEntitySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  display_name: z.string().trim().min(1, 'Display name is required').max(200, 'Display name must be less than 200 characters'),
  description: z.string().trim().max(1000, 'Description must be less than 1000 characters').optional().nullable(),
  position: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

// Class schema
export const classSchema = baseEntitySchema;
export type ClassFormData = z.infer<typeof classSchema>;

// Subject schema
export const subjectSchema = baseEntitySchema.extend({
  class_id: z.string().uuid('Invalid class'),
});
export type SubjectFormData = z.infer<typeof subjectSchema>;

// Chapter schema
export const chapterSchema = baseEntitySchema.extend({
  subject_id: z.string().uuid('Invalid subject'),
});
export type ChapterFormData = z.infer<typeof chapterSchema>;

// Topic schema
export const topicSchema = baseEntitySchema.extend({
  chapter_id: z.string().uuid('Invalid chapter'),
});
export type TopicFormData = z.infer<typeof topicSchema>;

// SubTopic schema
export const subTopicSchema = baseEntitySchema.extend({
  topic_id: z.string().uuid('Invalid topic'),
});
export type SubTopicFormData = z.infer<typeof subTopicSchema>;

// Difficulty level
export const difficultyLevelSchema = z.enum(['easy', 'medium', 'hard']);
export type DifficultyLevel = z.infer<typeof difficultyLevelSchema>;

// MCQ Option schema
export const mcqOptionSchema = z.object({
  text: z.string().trim().min(1, 'Option text is required'),
});

// MCQ schema
export const mcqSchema = z.object({
  sub_topic_id: z.string().uuid('Invalid sub-topic'),
  question: z.string().trim().min(1, 'Question is required').max(2000, 'Question must be less than 2000 characters'),
  options: z.array(mcqOptionSchema).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
  correct_answer: z.number().int().min(0, 'Select correct answer'),
  explanation: z.string().trim().max(2000, 'Explanation must be less than 2000 characters').optional().nullable(),
  difficulty: difficultyLevelSchema.default('medium'),
  position: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});
export type McqFormData = z.infer<typeof mcqSchema>;

// CQ schema
export const cqSchema = z.object({
  sub_topic_id: z.string().uuid('Invalid sub-topic'),
  context: z.string().trim().min(1, 'Context/Stimulus is required').max(5000, 'Context must be less than 5000 characters'),
  question_a: z.string().trim().min(1, 'Question A is required').max(1000),
  question_b: z.string().trim().min(1, 'Question B is required').max(1000),
  question_c: z.string().trim().min(1, 'Question C is required').max(1000),
  question_d: z.string().trim().min(1, 'Question D is required').max(1000),
  answer_a: z.string().trim().max(2000).optional().nullable(),
  answer_b: z.string().trim().max(2000).optional().nullable(),
  answer_c: z.string().trim().max(2000).optional().nullable(),
  answer_d: z.string().trim().max(2000).optional().nullable(),
  difficulty: difficultyLevelSchema.default('medium'),
  position: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});
export type CqFormData = z.infer<typeof cqSchema>;

// Auth schemas
export const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
export type SignUpFormData = z.infer<typeof signUpSchema>;
