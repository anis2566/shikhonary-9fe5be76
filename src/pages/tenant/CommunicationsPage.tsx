import React, { useState } from 'react';
import {
  MessageSquare,
  Calendar,
  FileText,
  History,
  BarChart3,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NotificationSender from '@/components/tenant/communication/NotificationSender';
import AnnouncementScheduler from '@/components/tenant/communication/AnnouncementScheduler';
import MessageTemplateList from '@/components/tenant/communication/MessageTemplateList';
import { MessageTemplate } from '@/lib/message-templates';
import { toast } from '@/hooks/use-toast';

// Mock data for history
const messageHistory = [
  {
    id: '1',
    type: 'whatsapp',
    title: 'Fee Due Reminder',
    recipients: 45,
    sentAt: '2024-02-01 10:30 AM',
    status: 'delivered',
  },
  {
    id: '2',
    type: 'sms',
    title: 'Exam Schedule Update',
    recipients: 120,
    sentAt: '2024-01-30 2:00 PM',
    status: 'delivered',
  },
  {
    id: '3',
    type: 'whatsapp',
    title: 'Holiday Notice',
    recipients: 485,
    sentAt: '2024-01-28 9:00 AM',
    status: 'delivered',
  },
  {
    id: '4',
    type: 'sms',
    title: 'Low Attendance Alert',
    recipients: 31,
    sentAt: '2024-01-25 4:30 PM',
    status: 'partial',
  },
];

const CommunicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('send');

  const handleTemplateSelect = (template: MessageTemplate) => {
    setActiveTab('send');
    toast({
      title: 'Template Selected',
      description: `"${template.name}" has been loaded. Switch to Send tab to compose.`,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communications</h1>
        <p className="text-muted-foreground">
          Send notifications and manage announcements
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,450</p>
                <p className="text-xs text-muted-foreground">Messages Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-muted-foreground">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="send" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-6">
          <NotificationSender />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <AnnouncementScheduler />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <MessageTemplateList
                onSelectTemplate={handleTemplateSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Message History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messageHistory.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        message.type === 'whatsapp' 
                          ? 'bg-emerald-500/10' 
                          : 'bg-primary/10'
                      }`}>
                        <MessageSquare className={`h-5 w-5 ${
                          message.type === 'whatsapp' 
                            ? 'text-emerald-500' 
                            : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{message.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {message.recipients} recipients • {message.sentAt}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={message.status === 'delivered' ? 'default' : 'secondary'}
                      className={
                        message.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                          : ''
                      }
                    >
                      {message.status === 'delivered' ? 'Delivered' : 'Partial'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsPage;
