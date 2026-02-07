import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  User,
  GraduationCap,
  Heart,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Droplet,
  IdCard,
  Users,
  BookOpen,
  Globe,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StudentFormData, groupOptions, shiftOptions, genderOptions, bloodGroupOptions, religionOptions } from '@/lib/validations/student';
import { mockBatches } from '@/lib/tenant-mock-data';

// Mock classes data
const mockClasses = [
  { id: 'cls-1', name: 'Class 10' },
  { id: 'cls-2', name: 'Class 9' },
  { id: 'cls-3', name: 'Class 8' },
  { id: 'cls-4', name: 'Class 7' },
  { id: 'cls-5', name: 'Class 6' },
];

interface StepReviewProps {
  form: UseFormReturn<StudentFormData>;
  onEditStep: (step: number) => void;
}

const StepReview: React.FC<StepReviewProps> = ({ form, onEditStep }) => {
  const formData = form.watch();

  // Get display values
  const className = mockClasses.find((c) => c.id === formData.academicClassId)?.name || '-';
  const batchName = mockBatches.find((b) => b.id === formData.batchId)?.name || '-';
  const groupLabel = groupOptions.find((g) => g.value === formData.group)?.label || '-';
  const shiftLabel = shiftOptions.find((s) => s.value === formData.shift)?.label || '-';
  const genderLabel = genderOptions.find((g) => g.value === formData.gender)?.label || '-';
  const bloodGroupLabel = bloodGroupOptions.find((b) => b.value === formData.bloodGroup)?.label || '-';
  const religionLabel = religionOptions.find((r) => r.value === formData.religion)?.label || '-';

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

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
          <div className="p-2 rounded-full bg-green-500/10 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground">Review & Confirm</h2>
        </div>
        <p className="text-muted-foreground">
          Please review all the information before submitting
        </p>
      </motion.div>

      {/* Student Preview Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                {formData.name
                  ? formData.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'ST'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{formData.name || 'Student Name'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">ID: {formData.studentId || '-'}</Badge>
                  <Badge variant="outline">{className}</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Basic Information Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription>Identity and contact details</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <InfoRow icon={User} label="Full Name" value={formData.name} />
              <InfoRow icon={IdCard} label="Student ID" value={formData.studentId} />
              <InfoRow icon={Mail} label="Email" value={formData.email || ''} />
              <InfoRow icon={Phone} label="Primary Phone" value={formData.primaryPhone} />
              <InfoRow icon={Phone} label="Secondary Phone" value={formData.secondaryPhone || ''} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Academic Information Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Academic Information</CardTitle>
                  <CardDescription>Class, batch, and academic details</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              <InfoRow icon={BookOpen} label="Class" value={className} />
              <InfoRow icon={Users} label="Batch" value={batchName} />
              <InfoRow icon={IdCard} label="Roll" value={formData.roll || ''} />
              <InfoRow icon={BookOpen} label="Section" value={formData.section || ''} />
              <InfoRow icon={BookOpen} label="Group" value={groupLabel} />
              <InfoRow icon={Calendar} label="Shift" value={shiftLabel} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Details Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Personal Details</CardTitle>
                  <CardDescription>Family and personal information</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              <InfoRow icon={User} label="Father's Name" value={formData.fatherName || ''} />
              <InfoRow icon={User} label="Mother's Name" value={formData.motherName || ''} />
              <InfoRow icon={Calendar} label="Date of Birth" value={formData.dateOfBirth || ''} />
              <InfoRow icon={User} label="Gender" value={genderLabel} />
              <InfoRow icon={Droplet} label="Blood Group" value={bloodGroupLabel} />
              <InfoRow icon={Globe} label="Nationality" value={formData.nationality || ''} />
              <InfoRow icon={Globe} label="Religion" value={religionLabel} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Address Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Address Information</CardTitle>
                  <CardDescription>Present and permanent addresses</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onEditStep(4)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Present Address</p>
              <p className="text-sm text-foreground">{formData.presentAddress || '-'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Permanent Address</p>
              <p className="text-sm text-foreground">
                {formData.sameAsPresentAddress
                  ? 'Same as present address'
                  : formData.permanentAddress || '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation Box */}
      <motion.div variants={itemVariants}>
        <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Ready to Submit</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please verify all information is correct. Click "Create Student" to complete the registration.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepReview;
