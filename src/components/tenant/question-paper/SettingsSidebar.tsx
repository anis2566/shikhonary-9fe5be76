import React from 'react';
import {
  Download,
  Settings2,
  FileText,
  Type,
  Shuffle,
  MapPin,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { PaperSettings } from './types';

interface SettingsSidebarProps {
  settings: PaperSettings;
  onSettingsChange: (settings: PaperSettings) => void;
  onExportPdf: () => void;
  isExporting: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  settings,
  onSettingsChange,
  onExportPdf,
  isExporting,
}) => {
  const updateSetting = <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5" />
          <h2 className="font-semibold">সেটিংস</h2>
        </div>
        <Button
          onClick={onExportPdf}
          disabled={isExporting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'ডাউনলোড'}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Question Settings */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 font-medium text-sm w-full hover:text-primary">
              <FileText className="w-4 h-4" />
              প্রশ্নে সংযুক্তি
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">উত্তরপত্র</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">OMR সংযুক্তি</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">গুরুত্বপূর্ণ প্রশ্ন</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">প্রশ্নের তথ্য</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">শিক্ষার্থীর তথ্য</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">প্রশ্ন নম্বর ঘর</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">বিষয় কোড</Label>
                <Switch checked={false} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Header Visibility Controls */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 font-medium text-sm w-full hover:text-primary">
              <Type className="w-4 h-4" />
              হেডার দৃশ্যমানতা
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">শ্রেণির নাম</Label>
                <Switch
                  checked={settings.showClassName}
                  onCheckedChange={(v) => updateSetting('showClassName', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">বিষয়ের নাম</Label>
                <Switch
                  checked={settings.showSubjectName}
                  onCheckedChange={(v) => updateSetting('showSubjectName', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">অধ্যায়ের নাম</Label>
                <Switch
                  checked={settings.showChapterName}
                  onCheckedChange={(v) => updateSetting('showChapterName', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">সেট কোড</Label>
                <Switch
                  checked={settings.showSetCode}
                  onCheckedChange={(v) => updateSetting('showSetCode', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">পরীক্ষার নাম</Label>
                <Switch
                  checked={settings.showExamName}
                  onCheckedChange={(v) => updateSetting('showExamName', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">সময়</Label>
                <Switch
                  checked={settings.showTime}
                  onCheckedChange={(v) => updateSetting('showTime', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">পূর্ণমান</Label>
                <Switch
                  checked={settings.showTotalMarks}
                  onCheckedChange={(v) => updateSetting('showTotalMarks', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">নির্দেশনা</Label>
                <Switch
                  checked={settings.showInstructions}
                  onCheckedChange={(v) => updateSetting('showInstructions', v)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Document Customization */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 font-medium text-sm w-full hover:text-primary">
              <Settings2 className="w-4 h-4" />
              ডকুমেন্ট কাস্টমাইজেশন
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* Paper Size */}
              <div className="space-y-2">
                <Label className="text-sm">পেপার সাইজ</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['A4', 'Letter', 'Legal', 'A5'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('paperSize', size)}
                      className={cn(
                        'border rounded-md p-2 text-xs transition-colors',
                        settings.paperSize === size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'hover:border-primary/50'
                      )}
                    >
                      <div className="w-6 h-8 border mx-auto mb-1" />
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Orientation */}
              <div className="space-y-2">
                <Label className="text-sm">অরিয়েন্টেশন</Label>
                <ToggleGroup
                  type="single"
                  value={settings.paperOrientation}
                  onValueChange={(v) =>
                    v && updateSetting('paperOrientation', v as 'portrait' | 'landscape')
                  }
                  className="justify-start"
                >
                  <ToggleGroupItem value="portrait" size="sm" className="px-3 gap-2">
                    <div className="w-4 h-6 border" />
                    পোর্ট্রেট
                  </ToggleGroupItem>
                  <ToggleGroupItem value="landscape" size="sm" className="px-3 gap-2">
                    <div className="w-6 h-4 border" />
                    ল্যান্ডস্কেপ
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Option Style */}
              <div className="space-y-2">
                <Label className="text-sm">অপশন স্টাইল</Label>
                <ToggleGroup
                  type="single"
                  value={settings.optionStyle}
                  onValueChange={(v) =>
                    v && updateSetting('optionStyle', v as PaperSettings['optionStyle'])
                  }
                  className="justify-start flex-wrap"
                >
                  <ToggleGroupItem value="parentheses" size="sm" className="px-3">
                    (ক)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dot" size="sm" className="px-3">
                    ক.
                  </ToggleGroupItem>
                  <ToggleGroupItem value="bracket" size="sm" className="px-3">
                    ক)
                  </ToggleGroupItem>
                  <ToggleGroupItem value="round" size="sm" className="px-3 gap-1">
                    <Circle className="w-4 h-4" />
                    ক
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Columns */}
              <div className="space-y-2">
                <Label className="text-sm">কলাম</Label>
                <ToggleGroup
                  type="single"
                  value={String(settings.columns)}
                  onValueChange={(v) =>
                    v && updateSetting('columns', parseInt(v) as 1 | 2 | 3)
                  }
                  className="justify-start"
                >
                  <ToggleGroupItem value="1" size="sm" className="px-4">
                    <div className="w-4 h-6 border" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2" size="sm" className="px-4">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-6 border" />
                      <div className="w-2 h-6 border" />
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="3" size="sm" className="px-4">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-6 border" />
                      <div className="w-1.5 h-6 border" />
                      <div className="w-1.5 h-6 border" />
                    </div>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Column Divider */}
              <div className="flex items-center justify-between">
                <Label className="text-sm">কলাম ডিভাইডার</Label>
                <Switch
                  checked={settings.showColumnDivider}
                  onCheckedChange={(v) => updateSetting('showColumnDivider', v)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Additional Tools */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 font-medium text-sm w-full hover:text-primary">
              <Shuffle className="w-4 h-4" />
              সহায়ক টুলস
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">পুনরাবৃত্ত প্রশ্ন শনাক্ত</Label>
                  <Switch
                    checked={settings.detectDuplicates}
                    onCheckedChange={(v) => updateSetting('detectDuplicates', v)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  একই প্রশ্ন একাধিকবার নির্বাচিত হলে সহজে শনাক্ত ও পরিবর্তন করা যাবে।
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">শীট</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">শাফল (সেট কোড তৈরী)</Label>
                  <Shuffle className="w-4 h-4 text-muted-foreground" />
                </div>
                <Switch
                  checked={settings.enableShuffle}
                  onCheckedChange={(v) => updateSetting('enableShuffle', v)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Branding */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 font-medium text-sm w-full hover:text-primary">
              <MapPin className="w-4 h-4" />
              ব্রান্ডিং
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">ঠিকানা</Label>
                <Switch
                  checked={settings.showAddress}
                  onCheckedChange={(v) => updateSetting('showAddress', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">জলছাপ</Label>
                <Switch
                  checked={settings.showWatermark}
                  onCheckedChange={(v) => updateSetting('showWatermark', v)}
                />
              </div>
              {settings.showWatermark && (
                <Input
                  placeholder="Watermark text"
                  value={settings.watermark}
                  onChange={(e) => updateSetting('watermark', e.target.value)}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingsSidebar;
