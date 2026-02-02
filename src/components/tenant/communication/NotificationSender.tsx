import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Users,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import MessageTemplateList from './MessageTemplateList';
import {
  MessageTemplate,
  parseTemplate,
} from '@/lib/message-templates';
import { toast } from '@/hooks/use-toast';

interface RecipientGroup {
  id: string;
  name: string;
  count: number;
  type: 'batch' | 'class' | 'custom';
}

const recipientGroups: RecipientGroup[] = [
  { id: 'all', name: 'All Parents', count: 485, type: 'custom' },
  { id: 'class-10', name: 'Class 10 Parents', count: 120, type: 'class' },
  { id: 'class-9', name: 'Class 9 Parents', count: 115, type: 'class' },
  { id: 'morning', name: 'Morning Batch', count: 156, type: 'batch' },
  { id: 'evening', name: 'Evening Batch', count: 142, type: 'batch' },
  { id: 'defaulters', name: 'Fee Defaulters', count: 23, type: 'custom' },
  { id: 'low-attendance', name: 'Low Attendance (<75%)', count: 31, type: 'custom' },
];

const NotificationSender: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [showTemplates, setShowTemplates] = useState(true);

  const totalRecipients = selectedRecipients.reduce((sum, id) => {
    const group = recipientGroups.find((g) => g.id === id);
    return sum + (group?.count || 0);
  }, 0);

  const handleRecipientToggle = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage(template.body);
    setShowTemplates(false);
  };

  const handleSend = async () => {
    if (!customMessage.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }
    if (selectedRecipients.length === 0) {
      toast({ title: 'Error', description: 'Please select recipients', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    setSendProgress(0);

    // Simulate sending progress
    const interval = setInterval(() => {
      setSendProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    clearInterval(interval);
    setSendProgress(100);
    setIsSending(false);

    toast({
      title: 'Notifications Sent!',
      description: `Successfully sent ${channel.toUpperCase()} to ${totalRecipients} recipients`,
    });

    // Reset form
    setSelectedTemplate(null);
    setCustomMessage('');
    setSelectedRecipients([]);
    setSendProgress(0);
    setShowTemplates(true);
  };

  const estimatedCost = totalRecipients * (channel === 'sms' ? 0.5 : 0.25);

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose a Template</CardTitle>
            <CardDescription>
              Select a pre-built template or create a custom message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessageTemplateList
              onSelectTemplate={handleTemplateSelect}
              selectedTemplateId={selectedTemplate?.id}
            />
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setShowTemplates(false)}>
                Or write a custom message →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Composer */}
      {!showTemplates && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {channel === 'whatsapp' ? (
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Phone className="h-5 w-5 text-primary" />
                  )}
                  Compose Message
                </CardTitle>
                {selectedTemplate && (
                  <CardDescription>
                    Using template: {selectedTemplate.name}
                  </CardDescription>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)}>
                Change Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Channel Selection */}
            <div className="space-y-3">
              <Label>Delivery Channel</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors flex-1">
                  <input
                    type="radio"
                    name="channel"
                    value="whatsapp"
                    checked={channel === 'whatsapp'}
                    onChange={() => setChannel('whatsapp')}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-full ${channel === 'whatsapp' ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                    <MessageSquare className={`h-5 w-5 ${channel === 'whatsapp' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">৳0.25/message</p>
                  </div>
                  {channel === 'whatsapp' && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                  )}
                </label>
                <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors flex-1">
                  <input
                    type="radio"
                    name="channel"
                    value="sms"
                    checked={channel === 'sms'}
                    onChange={() => setChannel('sms')}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-full ${channel === 'sms' ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Phone className={`h-5 w-5 ${channel === 'sms' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-xs text-muted-foreground">৳0.50/message</p>
                  </div>
                  {channel === 'sms' && (
                    <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                  )}
                </label>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{customMessage.length} characters</span>
                {channel === 'sms' && customMessage.length > 160 && (
                  <span className="text-amber-500">
                    {Math.ceil(customMessage.length / 160)} SMS segments
                  </span>
                )}
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Recipients
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {recipientGroups.map((group) => (
                  <label
                    key={group.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRecipients.includes(group.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(group.id)}
                        onChange={() => handleRecipientToggle(group.id)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{group.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {group.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            {totalRecipients > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Send Summary</AlertTitle>
                <AlertDescription>
                  Sending to <strong>{totalRecipients}</strong> recipients via {channel.toUpperCase()}.
                  Estimated cost: <strong>৳{estimatedCost.toFixed(2)}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Send Progress */}
            {isSending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sending notifications...</span>
                  <span className="font-medium">{sendProgress}%</span>
                </div>
                <Progress value={sendProgress} />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTemplates(true);
                  setSelectedTemplate(null);
                  setCustomMessage('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending || !customMessage.trim() || selectedRecipients.length === 0}
                className="gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSender;
