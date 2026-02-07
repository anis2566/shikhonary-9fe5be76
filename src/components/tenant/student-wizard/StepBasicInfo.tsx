import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, IdCard, Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentFormData } from '@/lib/validations/student';

interface StepBasicInfoProps {
  form: UseFormReturn<StudentFormData>;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

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
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Basic Information</h2>
        <p className="text-muted-foreground mt-1">
          Enter the student's primary details and contact information
        </p>
      </motion.div>

      {/* Main Info Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Identity Details</CardTitle>
                <CardDescription>Student name and unique identifier</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter student's full name"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-muted-foreground" />
                  Student ID / Roll Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentId"
                  placeholder="e.g., 2024001"
                  {...register('studentId')}
                  className={errors.studentId ? 'border-destructive' : ''}
                />
                {errors.studentId && (
                  <p className="text-sm text-destructive">{errors.studentId.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Info Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Contact Information</CardTitle>
                <CardDescription>Email and phone numbers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Primary Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="primaryPhone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  {...register('primaryPhone')}
                  className={errors.primaryPhone ? 'border-destructive' : ''}
                />
                {errors.primaryPhone && (
                  <p className="text-sm text-destructive">{errors.primaryPhone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryPhone" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  Secondary Phone
                </Label>
                <Input
                  id="secondaryPhone"
                  type="tel"
                  placeholder="Optional"
                  {...register('secondaryPhone')}
                  className={errors.secondaryPhone ? 'border-destructive' : ''}
                />
                {errors.secondaryPhone && (
                  <p className="text-sm text-destructive">{errors.secondaryPhone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants}>
        <div className="rounded-lg bg-muted/50 p-4 border border-muted">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">💡 Tip:</strong> The Student ID should be unique and will be used for login and identification purposes.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepBasicInfo;
