import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Clock, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StudentFormData, groupOptions, shiftOptions } from '@/lib/validations/student';
import { mockBatches } from '@/lib/tenant-mock-data';

// Mock classes data
const mockClasses = [
  { id: 'cls-1', name: 'Class 10' },
  { id: 'cls-2', name: 'Class 9' },
  { id: 'cls-3', name: 'Class 8' },
  { id: 'cls-4', name: 'Class 7' },
  { id: 'cls-5', name: 'Class 6' },
];

interface StepAcademicInfoProps {
  form: UseFormReturn<StudentFormData>;
}

const StepAcademicInfo: React.FC<StepAcademicInfoProps> = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form;
  const selectedClassId = watch('academicClassId');

  // Filter batches based on selected class
  const filteredBatches = mockBatches.filter(
    (batch) => batch.academicClassId === selectedClassId
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center lg:text-left">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Academic Information</h2>
        <p className="text-muted-foreground mt-1">
          Select the student's class, batch, and academic details
        </p>
      </motion.div>

      {/* Class & Batch Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Class & Batch</CardTitle>
                <CardDescription>Academic enrollment details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch('academicClassId')}
                  onValueChange={(value) => {
                    setValue('academicClassId', value);
                    setValue('batchId', ''); // Reset batch when class changes
                  }}
                >
                  <SelectTrigger className={errors.academicClassId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.academicClassId && (
                  <p className="text-sm text-destructive">{errors.academicClassId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Batch
                </Label>
                <Select
                  value={watch('batchId') || ''}
                  onValueChange={(value) => setValue('batchId', value)}
                  disabled={!selectedClassId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedClassId ? 'Select batch' : 'Select class first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name} ({batch.currentSize}/{batch.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Academic Details Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Additional Details</CardTitle>
                <CardDescription>Section, group, and shift information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="roll" className="flex items-center gap-2">
                  Roll Number
                </Label>
                <Input
                  id="roll"
                  placeholder="e.g., 01"
                  {...register('roll')}
                  className={errors.roll ? 'border-destructive' : ''}
                />
                {errors.roll && (
                  <p className="text-sm text-destructive">{errors.roll.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="section" className="flex items-center gap-2">
                  Section
                </Label>
                <Input
                  id="section"
                  placeholder="e.g., A"
                  {...register('section')}
                  className={errors.section ? 'border-destructive' : ''}
                />
                {errors.section && (
                  <p className="text-sm text-destructive">{errors.section.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Group
                </Label>
                <Select
                  value={watch('group') || ''}
                  onValueChange={(value) => setValue('group', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Shift
                </Label>
                <Select
                  value={watch('shift') || ''}
                  onValueChange={(value) => setValue('shift', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Box */}
      <motion.div variants={itemVariants}>
        <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">📚 Note:</strong> Batch assignment determines which classes and exams the student can access. You can change this later if needed.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepAcademicInfo;
