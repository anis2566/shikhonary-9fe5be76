import { z } from 'zod';

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  studentId: z.string().trim().min(1, 'Student ID is required').max(50, 'Student ID must be less than 50 characters'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  primaryPhone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  secondaryPhone: z.string().trim().max(15, 'Phone number must be less than 15 digits').optional().or(z.literal('')),
});

// Step 2: Academic Information
export const academicInfoSchema = z.object({
  academicClassId: z.string().min(1, 'Class is required'),
  batchId: z.string().optional().or(z.literal('')),
  roll: z.string().trim().max(20, 'Roll must be less than 20 characters').optional().or(z.literal('')),
  group: z.string().optional().or(z.literal('')),
  shift: z.string().optional().or(z.literal('')),
  section: z.string().trim().max(10, 'Section must be less than 10 characters').optional().or(z.literal('')),
});

// Step 3: Personal Details
export const personalDetailsSchema = z.object({
  fatherName: z.string().trim().max(100, 'Father name must be less than 100 characters').optional().or(z.literal('')),
  motherName: z.string().trim().max(100, 'Mother name must be less than 100 characters').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  bloodGroup: z.string().optional().or(z.literal('')),
  nationality: z.string().trim().max(50, 'Nationality must be less than 50 characters').optional().or(z.literal('')),
  religion: z.string().optional().or(z.literal('')),
});

// Step 4: Address Information
export const addressInfoSchema = z.object({
  presentAddress: z.string().trim().max(500, 'Address must be less than 500 characters').optional().or(z.literal('')),
  permanentAddress: z.string().trim().max(500, 'Address must be less than 500 characters').optional().or(z.literal('')),
  sameAsPresentAddress: z.boolean().optional(),
});

// Combined full schema
export const studentFormSchema = basicInfoSchema
  .merge(academicInfoSchema)
  .merge(personalDetailsSchema)
  .merge(addressInfoSchema);

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;
export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;
export type AddressInfoFormData = z.infer<typeof addressInfoSchema>;
export type StudentFormData = z.infer<typeof studentFormSchema>;

// Default values
export const defaultStudentFormValues: StudentFormData = {
  name: '',
  studentId: '',
  email: '',
  primaryPhone: '',
  secondaryPhone: '',
  academicClassId: '',
  batchId: '',
  roll: '',
  group: '',
  shift: '',
  section: '',
  fatherName: '',
  motherName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  nationality: '',
  religion: '',
  presentAddress: '',
  permanentAddress: '',
  sameAsPresentAddress: false,
};

// Options
export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const groupOptions = [
  { value: 'science', label: 'Science' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts' },
  { value: 'general', label: 'General' },
];

export const shiftOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'day', label: 'Day' },
  { value: 'evening', label: 'Evening' },
];

export const religionOptions = [
  { value: 'islam', label: 'Islam' },
  { value: 'hinduism', label: 'Hinduism' },
  { value: 'christianity', label: 'Christianity' },
  { value: 'buddhism', label: 'Buddhism' },
  { value: 'other', label: 'Other' },
];
