import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Heart, User, Users, Calendar, Droplet, Globe, Church } from 'lucide-react';
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
import {
  StudentFormData,
  genderOptions,
  bloodGroupOptions,
  religionOptions,
} from '@/lib/validations/student';

interface StepPersonalDetailsProps {
  form: UseFormReturn<StudentFormData>;
}

const StepPersonalDetails: React.FC<StepPersonalDetailsProps> = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form;

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
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Personal Details</h2>
        <p className="text-muted-foreground mt-1">
          Enter family information and personal details
        </p>
      </motion.div>

      {/* Family Details Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Family Information</CardTitle>
                <CardDescription>Parent and guardian details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fatherName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Father's Name
                </Label>
                <Input
                  id="fatherName"
                  placeholder="Enter father's name"
                  {...register('fatherName')}
                  className={errors.fatherName ? 'border-destructive' : ''}
                />
                {errors.fatherName && (
                  <p className="text-sm text-destructive">{errors.fatherName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Mother's Name
                </Label>
                <Input
                  id="motherName"
                  placeholder="Enter mother's name"
                  {...register('motherName')}
                  className={errors.motherName ? 'border-destructive' : ''}
                />
                {errors.motherName && (
                  <p className="text-sm text-destructive">{errors.motherName.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Details Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Date of birth, gender, and other details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className={errors.dateOfBirth ? 'border-destructive' : ''}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Gender
                </Label>
                <Select
                  value={watch('gender') || ''}
                  onValueChange={(value) => setValue('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-muted-foreground" />
                  Blood Group
                </Label>
                <Select
                  value={watch('bloodGroup') || ''}
                  onValueChange={(value) => setValue('bloodGroup', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  placeholder="e.g., Bangladeshi"
                  {...register('nationality')}
                  className={errors.nationality ? 'border-destructive' : ''}
                />
                {errors.nationality && (
                  <p className="text-sm text-destructive">{errors.nationality.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Church className="w-4 h-4 text-muted-foreground" />
                  Religion
                </Label>
                <Select
                  value={watch('religion') || ''}
                  onValueChange={(value) => setValue('religion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {religionOptions.map((option) => (
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
        <div className="rounded-lg bg-purple-500/10 p-4 border border-purple-500/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">🔒 Privacy:</strong> All personal information is stored securely and only accessible to authorized administrators.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepPersonalDetails;
