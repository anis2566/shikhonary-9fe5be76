import React, { useState } from 'react';
import { Copy, Check, Mail, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const EmailTemplatePreview: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [tenantName, setTenantName] = useState('ABC High School');
  const [inviterName, setInviterName] = useState('Admin User');
  const [recipientName, setRecipientName] = useState('John Doe');
  const [invitationLink, setInvitationLink] = useState('https://example.com/invitation/accept?token=abc123');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(emailCode);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Email template code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Email HTML preview
  const emailPreviewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a5f4a 0%, #2d8a6e 100%); padding: 40px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">You're Invited!</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 40px;">
            <p style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0 0 20px;">
              ${recipientName ? `Hello ${recipientName},` : 'Hello,'}
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
              Great news! <strong>${inviterName}</strong> has invited you to join 
              <strong style="color: #1a5f4a;">${tenantName}</strong> as a 
              <strong>Tenant Administrator</strong>.
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
              As an administrator, you'll have full access to manage students, teachers, exams, and all institutional operations.
            </p>
            
            <!-- Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${invitationLink}" style="background-color: #1a5f4a; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 14px 32px; box-shadow: 0 4px 12px rgba(26, 95, 74, 0.3);">
                Accept Invitation
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; line-height: 22px; text-align: center; margin: 0;">
              If you don't have an account yet, you'll be guided through creating one after clicking the button above.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0;" />
          
          <!-- Info Cards -->
          <div style="padding: 24px 20px; background-color: #f8fafc;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: center; padding: 12px 8px; vertical-align: top;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🏫</div>
                  <p style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Institution</p>
                  <p style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin: 0;">${tenantName}</p>
                </td>
                <td style="text-align: center; padding: 12px 8px; vertical-align: top;">
                  <div style="font-size: 24px; margin-bottom: 8px;">👤</div>
                  <p style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Invited By</p>
                  <p style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin: 0;">${inviterName}</p>
                </td>
                <td style="text-align: center; padding: 12px 8px; vertical-align: top;">
                  <div style="font-size: 24px; margin-bottom: 8px;">⏰</div>
                  <p style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Expires In</p>
                  <p style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin: 0;">7 Days</p>
                </td>
              </tr>
            </table>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0;" />
          
          <!-- Footer -->
          <div style="padding: 24px 40px; text-align: center;">
            <p style="color: #718096; font-size: 13px; line-height: 20px; margin: 0 0 8px;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
            <p style="color: #718096; font-size: 13px; line-height: 20px; margin: 0 0 8px;">
              Need help? <a href="mailto:support@example.com" style="color: #1a5f4a; text-decoration: underline;">Contact Support</a>
            </p>
            <p style="color: #a0aec0; font-size: 12px; margin: 16px 0 0;">
              © ${new Date().getFullYear()} EduManage. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const emailCode = `import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvitationEmailProps {
  tenantName: string;
  inviterName: string;
  invitationLink: string;
  recipientName?: string;
}

export const InvitationEmail = ({
  tenantName = "ABC High School",
  inviterName = "Admin User",
  invitationLink = "https://example.com/invitation/accept?token=abc123",
  recipientName,
}: InvitationEmailProps) => {
  const previewText = \`You've been invited to join \${tenantName} as an administrator\`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient background */}
          <Section style={header}>
            <div style={logoContainer}>
              <div style={logoIcon}>📚</div>
            </div>
            <Heading style={headerTitle}>You're Invited!</Heading>
          </Section>

          {/* Main content */}
          <Section style={content}>
            <Text style={greeting}>
              {recipientName ? \`Hello \${recipientName},\` : "Hello,"}
            </Text>

            <Text style={paragraph}>
              Great news! <strong>{inviterName}</strong> has invited you to join{" "}
              <strong style={highlight}>{tenantName}</strong> as a{" "}
              <strong>Tenant Administrator</strong>.
            </Text>

            <Text style={paragraph}>
              As an administrator, you'll have full access to manage students,
              teachers, exams, and all institutional operations.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={invitationLink}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={helperText}>
              If you don't have an account yet, you'll be guided through creating
              one after clicking the button above.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Info cards */}
          <Section style={infoSection}>
            <table style={infoTable}>
              <tr>
                <td style={infoCard}>
                  <div style={infoIcon}>🏫</div>
                  <Text style={infoTitle}>Institution</Text>
                  <Text style={infoValue}>{tenantName}</Text>
                </td>
                <td style={infoCard}>
                  <div style={infoIcon}>👤</div>
                  <Text style={infoTitle}>Invited By</Text>
                  <Text style={infoValue}>{inviterName}</Text>
                </td>
                <td style={infoCard}>
                  <div style={infoIcon}>⏰</div>
                  <Text style={infoTitle}>Expires In</Text>
                  <Text style={infoValue}>7 Days</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you didn't expect this invitation, you can safely ignore this
              email.
            </Text>
            <Text style={footerText}>
              Need help?{" "}
              <a href="mailto:support@example.com" style={link}>
                Contact Support
              </a>
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} EduManage. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvitationEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const header = {
  background: "linear-gradient(135deg, #1a5f4a 0%, #2d8a6e 100%)",
  padding: "40px 20px",
  textAlign: "center" as const,
};

const logoContainer = {
  marginBottom: "16px",
};

const logoIcon = {
  fontSize: "48px",
  display: "inline-block",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const content = {
  padding: "32px 40px",
};

const greeting = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 20px",
};

const paragraph = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const highlight = {
  color: "#1a5f4a",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1a5f4a",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  boxShadow: "0 4px 12px rgba(26, 95, 74, 0.3)",
};

const helperText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "0",
};

const divider = {
  borderColor: "#e2e8f0",
  margin: "0",
};

const infoSection = {
  padding: "24px 20px",
  backgroundColor: "#f8fafc",
};

const infoTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const infoCard = {
  textAlign: "center" as const,
  padding: "12px 8px",
  verticalAlign: "top" as const,
};

const infoIcon = {
  fontSize: "24px",
  marginBottom: "8px",
};

const infoTitle = {
  color: "#718096",
  fontSize: "12px",
  fontWeight: "500",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const infoValue = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#718096",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const link = {
  color: "#1a5f4a",
  textDecoration: "underline",
};

const copyright = {
  color: "#a0aec0",
  fontSize: "12px",
  margin: "16px 0 0",
};`;

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Invitation Email Template
            </h1>
            <p className="text-muted-foreground mt-1">
              Preview and customize your tenant admin invitation email
            </p>
          </div>
          <Button onClick={handleCopyCode} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Customize Preview</CardTitle>
              <CardDescription>
                Adjust the values to see how the email will look
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantName">Institution Name</Label>
                <Input
                  id="tenantName"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="ABC High School"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviterName">Inviter Name</Label>
                <Input
                  id="inviterName"
                  value={inviterName}
                  onChange={(e) => setInviterName(e.target.value)}
                  placeholder="Admin User"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invitationLink">Invitation Link</Label>
                <Input
                  id="invitationLink"
                  value={invitationLink}
                  onChange={(e) => setInvitationLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="gap-2">
                    <Code className="h-4 w-4" />
                    Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-4">
                  <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-[700px]">
                    <iframe
                      srcDoc={emailPreviewHtml}
                      className="w-full h-[650px] border-0 rounded-lg bg-white"
                      title="Email Preview"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="mt-4">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10"
                      onClick={handleCopyCode}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="bg-foreground text-background p-4 rounded-lg overflow-auto max-h-[650px] text-sm">
                      <code>{emailCode}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;
