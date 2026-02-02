import React, { useState } from 'react';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Send,
  Save,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ScheduledAnnouncement {
  id: string;
  title: string;
  message: string;
  scheduledDate: Date;
  targetAudience: string[];
  channels: string[];
  status: 'scheduled' | 'sent' | 'draft';
}

const audienceOptions = [
  { id: 'all-parents', label: 'All Parents' },
  { id: 'all-students', label: 'All Students' },
  { id: 'class-10', label: 'Class 10' },
  { id: 'class-9', label: 'Class 9' },
  { id: 'morning-batch', label: 'Morning Batch' },
  { id: 'evening-batch', label: 'Evening Batch' },
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
];

const quickScheduleOptions = [
  { label: 'In 1 hour', getValue: () => addHours(new Date(), 1) },
  { label: 'Tomorrow 9 AM', getValue: () => setMinutes(setHours(addDays(new Date(), 1), 9), 0) },
  { label: 'Tomorrow 5 PM', getValue: () => setMinutes(setHours(addDays(new Date(), 1), 17), 0) },
  { label: 'Next Monday 9 AM', getValue: () => {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    return setMinutes(setHours(addDays(today, daysUntilMonday), 9), 0);
  }},
];

const AnnouncementScheduler: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [channels, setChannels] = useState({
    sms: true,
    whatsapp: true,
    email: false,
  });
  const [sendImmediately, setSendImmediately] = useState(false);

  const handleAudienceToggle = (audienceId: string) => {
    setSelectedAudience((prev) =>
      prev.includes(audienceId)
        ? prev.filter((id) => id !== audienceId)
        : [...prev, audienceId]
    );
  };

  const handleQuickSchedule = (getValue: () => Date) => {
    const date = getValue();
    setSelectedDate(date);
    setSelectedTime(format(date, 'HH:00'));
  };

  const handleSchedule = () => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Please enter a title', variant: 'destructive' });
      return;
    }
    if (!message.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }
    if (!sendImmediately && !selectedDate) {
      toast({ title: 'Error', description: 'Please select a date', variant: 'destructive' });
      return;
    }
    if (selectedAudience.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one audience', variant: 'destructive' });
      return;
    }

    const activeChannels = Object.entries(channels)
      .filter(([_, active]) => active)
      .map(([channel]) => channel);

    if (activeChannels.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one channel', variant: 'destructive' });
      return;
    }

    // In a real app, this would call an API
    toast({
      title: sendImmediately ? 'Announcement Sent!' : 'Announcement Scheduled!',
      description: sendImmediately
        ? `Sent to ${selectedAudience.length} audience group(s) via ${activeChannels.join(', ')}`
        : `Scheduled for ${format(selectedDate!, 'PPP')} at ${selectedTime}`,
    });

    // Reset form
    setTitle('');
    setMessage('');
    setSelectedDate(undefined);
    setSelectedAudience([]);
  };

  return (
    <div className="space-y-6">
      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Schedule Announcement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length} characters
            </p>
          </div>

          {/* Send Immediately Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label htmlFor="send-now">Send Immediately</Label>
              <p className="text-sm text-muted-foreground">
                Skip scheduling and send right away
              </p>
            </div>
            <Switch
              id="send-now"
              checked={sendImmediately}
              onCheckedChange={setSendImmediately}
            />
          </div>

          {/* Date & Time Picker */}
          {!sendImmediately && (
            <div className="space-y-4">
              <Label>Schedule Date & Time</Label>
              
              {/* Quick Schedule Options */}
              <div className="flex flex-wrap gap-2">
                {quickScheduleOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSchedule(option.getValue)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full sm:w-[280px] justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Time Picker */}
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Target Audience */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Target Audience
            </Label>
            <div className="flex flex-wrap gap-2">
              {audienceOptions.map((audience) => (
                <Badge
                  key={audience.id}
                  variant={selectedAudience.includes(audience.id) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                  onClick={() => handleAudienceToggle(audience.id)}
                >
                  {audience.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div className="space-y-3">
            <Label>Delivery Channels</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={channels.sms}
                  onCheckedChange={(checked) => setChannels({ ...channels, sms: checked })}
                />
                <span className="text-sm">SMS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={channels.whatsapp}
                  onCheckedChange={(checked) => setChannels({ ...channels, whatsapp: checked })}
                />
                <span className="text-sm">WhatsApp</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={channels.email}
                  onCheckedChange={(checked) => setChannels({ ...channels, email: checked })}
                />
                <span className="text-sm">Email</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button onClick={handleSchedule} className="gap-2 flex-1 sm:flex-none">
              <Send className="h-4 w-4" />
              {sendImmediately ? 'Send Now' : 'Schedule Announcement'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementScheduler;
