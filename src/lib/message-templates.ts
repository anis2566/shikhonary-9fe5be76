// Message template types and default templates for communication tools

export type TemplateCategory = 'attendance' | 'results' | 'fees' | 'general' | 'exam';

export interface MessageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  subject: string;
  body: string;
  variables: string[];
  channels: ('sms' | 'whatsapp' | 'email')[];
  isDefault: boolean;
}

export const defaultTemplates: MessageTemplate[] = [
  // Attendance Templates
  {
    id: 'att-absent-today',
    name: 'Absent Today Alert',
    category: 'attendance',
    subject: 'Attendance Alert - {{student_name}}',
    body: 'Dear {{parent_name}}, your child {{student_name}} was marked absent today ({{date}}). Please contact us if this was unexpected. - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'date', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },
  {
    id: 'att-low-attendance',
    name: 'Low Attendance Warning',
    category: 'attendance',
    subject: 'Attendance Warning - {{student_name}}',
    body: 'Dear {{parent_name}}, {{student_name}}\'s attendance is currently at {{attendance_percent}}%. Please ensure regular attendance. Contact: {{contact_number}} - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'attendance_percent', 'contact_number', 'institution_name'],
    channels: ['sms', 'whatsapp', 'email'],
    isDefault: true,
  },
  {
    id: 'att-late-arrival',
    name: 'Late Arrival Notice',
    category: 'attendance',
    subject: 'Late Arrival - {{student_name}}',
    body: 'Dear {{parent_name}}, {{student_name}} arrived late today at {{arrival_time}}. Regular punctuality is important for academic success. - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'arrival_time', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },

  // Results Templates
  {
    id: 'res-exam-result',
    name: 'Exam Result Published',
    category: 'results',
    subject: 'Exam Results Available - {{exam_name}}',
    body: 'Dear {{parent_name}}, {{student_name}}\'s results for {{exam_name}} are now available. Score: {{score}}/{{total_marks}} ({{percentage}}%). View details at {{portal_link}} - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'exam_name', 'score', 'total_marks', 'percentage', 'portal_link', 'institution_name'],
    channels: ['sms', 'whatsapp', 'email'],
    isDefault: true,
  },
  {
    id: 'res-progress-report',
    name: 'Monthly Progress Report',
    category: 'results',
    subject: 'Progress Report - {{month}} {{year}}',
    body: 'Dear {{parent_name}}, {{student_name}}\'s monthly progress report for {{month}} is ready. Overall grade: {{grade}}. Attendance: {{attendance}}%. Check portal for details. - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'month', 'year', 'grade', 'attendance', 'institution_name'],
    channels: ['whatsapp', 'email'],
    isDefault: true,
  },
  {
    id: 'res-improvement-needed',
    name: 'Performance Improvement Notice',
    category: 'results',
    subject: 'Academic Performance - {{student_name}}',
    body: 'Dear {{parent_name}}, we need to discuss {{student_name}}\'s performance in {{subject}}. Please schedule a meeting at your earliest convenience. Contact: {{teacher_contact}} - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'subject', 'teacher_contact', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },

  // Fee Templates
  {
    id: 'fee-due-reminder',
    name: 'Fee Due Reminder',
    category: 'fees',
    subject: 'Fee Payment Reminder',
    body: 'Dear {{parent_name}}, this is a reminder that {{student_name}}\'s fee of ৳{{amount}} for {{month}} is due on {{due_date}}. Please pay to avoid late charges. - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'amount', 'month', 'due_date', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },
  {
    id: 'fee-overdue',
    name: 'Fee Overdue Alert',
    category: 'fees',
    subject: 'Overdue Fee Notice',
    body: 'Dear {{parent_name}}, {{student_name}}\'s fee of ৳{{amount}} is overdue by {{days_overdue}} days. Late fee: ৳{{late_fee}}. Total due: ৳{{total_due}}. Please clear immediately. - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'amount', 'days_overdue', 'late_fee', 'total_due', 'institution_name'],
    channels: ['sms', 'whatsapp', 'email'],
    isDefault: true,
  },
  {
    id: 'fee-received',
    name: 'Fee Payment Confirmation',
    category: 'fees',
    subject: 'Payment Received - Receipt #{{receipt_number}}',
    body: 'Dear {{parent_name}}, payment of ৳{{amount}} for {{student_name}} received on {{date}}. Receipt #{{receipt_number}}. Thank you! - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'amount', 'date', 'receipt_number', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },

  // Exam Templates
  {
    id: 'exam-schedule',
    name: 'Exam Schedule Notification',
    category: 'exam',
    subject: 'Upcoming Exam - {{exam_name}}',
    body: 'Dear {{parent_name}}, {{exam_name}} for {{student_name}} is scheduled on {{date}} at {{time}}. Subjects: {{subjects}}. Please ensure proper preparation. - {{institution_name}}',
    variables: ['parent_name', 'student_name', 'exam_name', 'date', 'time', 'subjects', 'institution_name'],
    channels: ['sms', 'whatsapp', 'email'],
    isDefault: true,
  },
  {
    id: 'exam-reminder',
    name: 'Exam Tomorrow Reminder',
    category: 'exam',
    subject: 'Exam Tomorrow - {{subject}}',
    body: 'Reminder: {{student_name}} has {{subject}} exam tomorrow ({{date}}) at {{time}}. Please bring ID card and necessary materials. Good luck! - {{institution_name}}',
    variables: ['student_name', 'subject', 'date', 'time', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },

  // General Templates
  {
    id: 'gen-announcement',
    name: 'General Announcement',
    category: 'general',
    subject: '{{title}}',
    body: 'Dear Parents, {{message}} For queries, contact: {{contact_number}}. - {{institution_name}}',
    variables: ['title', 'message', 'contact_number', 'institution_name'],
    channels: ['sms', 'whatsapp', 'email'],
    isDefault: true,
  },
  {
    id: 'gen-holiday',
    name: 'Holiday Notice',
    category: 'general',
    subject: 'Holiday Notice - {{occasion}}',
    body: 'Dear Parents, please note that our institution will remain closed on {{date}} for {{occasion}}. Classes resume on {{resume_date}}. - {{institution_name}}',
    variables: ['date', 'occasion', 'resume_date', 'institution_name'],
    channels: ['sms', 'whatsapp'],
    isDefault: true,
  },
  {
    id: 'gen-meeting',
    name: 'Parent Meeting Invitation',
    category: 'general',
    subject: 'Parent-Teacher Meeting - {{date}}',
    body: 'Dear {{parent_name}}, you are invited to a Parent-Teacher meeting on {{date}} at {{time}}. Venue: {{venue}}. Please confirm attendance. - {{institution_name}}',
    variables: ['parent_name', 'date', 'time', 'venue', 'institution_name'],
    channels: ['sms', 'whatsapp', 'email'],
    isDefault: true,
  },
];

// Helper function to replace variables in template
export function parseTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

// Get templates by category
export function getTemplatesByCategory(category: TemplateCategory): MessageTemplate[] {
  return defaultTemplates.filter(t => t.category === category);
}

// Get category display name
export function getCategoryDisplayName(category: TemplateCategory): string {
  const names: Record<TemplateCategory, string> = {
    attendance: 'Attendance',
    results: 'Results & Reports',
    fees: 'Fee Management',
    exam: 'Examinations',
    general: 'General',
  };
  return names[category];
}
