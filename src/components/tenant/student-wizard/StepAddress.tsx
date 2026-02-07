import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin, Home, Building2, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentFormData } from '@/lib/validations/student';

interface StepAddressProps {
  form: UseFormReturn<StudentFormData>;
}

const StepAddress: React.FC<StepAddressProps> = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form;
  const sameAsPresentAddress = watch('sameAsPresentAddress');
  const presentAddress = watch('presentAddress');

  // Copy present address to permanent address when checkbox is checked
  useEffect(() => {
    if (sameAsPresentAddress) {
      setValue('permanentAddress', presentAddress);
    }
  }, [sameAsPresentAddress, presentAddress, setValue]);

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
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Address Information</h2>
        <p className="text-muted-foreground mt-1">
          Enter the student's present and permanent addresses
        </p>
      </motion.div>

      {/* Present Address Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Present Address</CardTitle>
                <CardDescription>Current residential address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="presentAddress" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Full Address
              </Label>
              <Textarea
                id="presentAddress"
                placeholder="House No., Road, Area, City, District, Postal Code"
                rows={4}
                {...register('presentAddress')}
                className={errors.presentAddress ? 'border-destructive' : ''}
              />
              {errors.presentAddress && (
                <p className="text-sm text-destructive">{errors.presentAddress.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Include house number, road name, area, city, district, and postal code
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Same Address Checkbox */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 border border-muted">
          <Checkbox
            id="sameAsPresentAddress"
            checked={sameAsPresentAddress}
            onCheckedChange={(checked) => setValue('sameAsPresentAddress', checked as boolean)}
          />
          <Label
            htmlFor="sameAsPresentAddress"
            className="flex items-center gap-2 cursor-pointer text-sm font-medium"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
            Permanent address is same as present address
          </Label>
        </div>
      </motion.div>

      {/* Permanent Address Card */}
      <motion.div variants={itemVariants}>
        <Card className={sameAsPresentAddress ? 'opacity-50' : ''}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Permanent Address</CardTitle>
                <CardDescription>Permanent or family address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="permanentAddress" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Full Address
              </Label>
              <Textarea
                id="permanentAddress"
                placeholder="House No., Road, Area, City, District, Postal Code"
                rows={4}
                disabled={sameAsPresentAddress}
                {...register('permanentAddress')}
                className={errors.permanentAddress ? 'border-destructive' : ''}
              />
              {errors.permanentAddress && (
                <p className="text-sm text-destructive">{errors.permanentAddress.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Box */}
      <motion.div variants={itemVariants}>
        <div className="rounded-lg bg-amber-500/10 p-4 border border-amber-500/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">📍 Address Tips:</strong> Providing accurate address information helps with communication and emergency contacts.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepAddress;
