import React from 'react';
import { Bell, Shield, Palette, Globe, Database, Mail } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const settingsSections = [
  {
    id: 'general',
    icon: Globe,
    title: 'General',
    description: 'Basic platform settings',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security',
    description: 'Authentication and access control',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Email and push notification settings',
  },
  {
    id: 'appearance',
    icon: Palette,
    title: 'Appearance',
    description: 'Branding and theme settings',
  },
  {
    id: 'database',
    icon: Database,
    title: 'Database',
    description: 'Tenant database configuration',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Email',
    description: 'SMTP and email templates',
  },
];

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Settings" subtitle="Configure platform settings" />

      <div className="p-4 lg:p-6">
        <div className="max-w-4xl space-y-6">
          {/* Quick Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-soft transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{section.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{section.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* General Settings */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">General Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your platform configuration</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input id="platformName" defaultValue="Shikhonary" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@shikhonary.com" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Input id="defaultLanguage" defaultValue="Bengali (বাংলা)" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Feature Toggles</h3>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Allow Self Registration</p>
                  <p className="text-xs text-muted-foreground">Users can create accounts without invitation</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Email Verification Required</p>
                  <p className="text-xs text-muted-foreground">Users must verify email before access</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Enable 2FA for all admin users</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Temporarily disable platform access</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-xl border border-destructive/30 p-4 sm:p-6 space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">Clear All Session Data</p>
                <p className="text-xs text-muted-foreground">
                  Log out all users from the platform
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Clear Sessions
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">Reset Platform Data</p>
                <p className="text-xs text-muted-foreground">
                  Remove all tenant and user data (cannot be undone)
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Reset Platform
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
