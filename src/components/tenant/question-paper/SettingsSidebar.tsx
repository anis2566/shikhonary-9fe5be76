import React from 'react';
import {
  Download,
  FileText,
  Layout,
  Type,
  Shuffle,
  Stamp,
  Eye,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

  const updateMargin = (side: 'top' | 'bottom' | 'left' | 'right', value: number) => {
    onSettingsChange({
      ...settings,
      margins: { ...settings.margins, [side]: value },
    });
  };

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      {/* Header with Export Button */}
      <div className="p-4 border-b space-y-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          ডকুমেন্ট সেটিংস
        </h2>
        <Button
          onClick={onExportPdf}
          disabled={isExporting}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'PDF ডাউনলোড করুন'}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          defaultValue={['page-setup', 'header-visibility']}
          className="px-4 py-2"
        >
          {/* Page Setup - Like MS Word's Page Layout */}
          <AccordionItem value="page-setup">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Layout className="w-4 h-4" />
                পেজ সেটআপ
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              {/* Paper Size */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  পেপার সাইজ
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['A4', 'Letter', 'Legal', 'A5'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('paperSize', size)}
                      className={cn(
                        'border rounded-md p-2 text-xs transition-all',
                        settings.paperSize === size
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                          : 'hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="w-5 h-7 border border-current mx-auto mb-1 rounded-sm" />
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  অরিয়েন্টেশন
                </Label>
                <ToggleGroup
                  type="single"
                  value={settings.paperOrientation}
                  onValueChange={(v) =>
                    v && updateSetting('paperOrientation', v as 'portrait' | 'landscape')
                  }
                  className="justify-start w-full"
                >
                  <ToggleGroupItem value="portrait" size="sm" className="flex-1 gap-2">
                    <div className="w-3 h-5 border border-current rounded-sm" />
                    পোর্ট্রেট
                  </ToggleGroupItem>
                  <ToggleGroupItem value="landscape" size="sm" className="flex-1 gap-2">
                    <div className="w-5 h-3 border border-current rounded-sm" />
                    ল্যান্ডস্কেপ
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Separator />

              {/* Margins */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  মার্জিন (mm)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">উপর</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[settings.margins.top]}
                        onValueChange={([v]) => updateMargin('top', v)}
                        min={5}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-6 text-right">{settings.margins.top}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">নীচে</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[settings.margins.bottom]}
                        onValueChange={([v]) => updateMargin('bottom', v)}
                        min={5}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-6 text-right">{settings.margins.bottom}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">বাম</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[settings.margins.left]}
                        onValueChange={([v]) => updateMargin('left', v)}
                        min={5}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-6 text-right">{settings.margins.left}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">ডান</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[settings.margins.right]}
                        onValueChange={([v]) => updateMargin('right', v)}
                        min={5}
                        max={50}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-6 text-right">{settings.margins.right}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Columns */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  কলাম লেআউট
                </Label>
                <ToggleGroup
                  type="single"
                  value={String(settings.columns)}
                  onValueChange={(v) =>
                    v && updateSetting('columns', parseInt(v) as 1 | 2 | 3)
                  }
                  className="justify-start w-full"
                >
                  <ToggleGroupItem value="1" size="sm" className="flex-1">
                    <div className="w-4 h-6 border border-current rounded-sm" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2" size="sm" className="flex-1">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-6 border border-current rounded-sm" />
                      <div className="w-2 h-6 border border-current rounded-sm" />
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="3" size="sm" className="flex-1">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-6 border border-current rounded-sm" />
                      <div className="w-1.5 h-6 border border-current rounded-sm" />
                      <div className="w-1.5 h-6 border border-current rounded-sm" />
                    </div>
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className="flex items-center justify-between pt-2">
                  <Label className="text-xs">কলাম ডিভাইডার দেখান</Label>
                  <Switch
                    checked={settings.showColumnDivider}
                    onCheckedChange={(v) => updateSetting('showColumnDivider', v)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Header Visibility */}
          <AccordionItem value="header-visibility">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4" />
                হেডার দৃশ্যমানতা
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2.5 pb-4">
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
            </AccordionContent>
          </AccordionItem>

          {/* Typography / Option Style */}
          <AccordionItem value="typography">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Type className="w-4 h-4" />
                টাইপোগ্রাফি
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              {/* Option Style */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  অপশন স্টাইল
                </Label>
                <ToggleGroup
                  type="single"
                  value={settings.optionStyle}
                  onValueChange={(v) =>
                    v && updateSetting('optionStyle', v as PaperSettings['optionStyle'])
                  }
                  className="justify-start w-full flex-wrap"
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
                    <Circle className="w-3.5 h-3.5" />
                    ক
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Shuffle & Tools */}
          <AccordionItem value="tools">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shuffle className="w-4 h-4" />
                শাফল ও টুলস
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">প্রশ্ন শাফল করুন</Label>
                  <Switch
                    checked={settings.shuffleQuestions}
                    onCheckedChange={(v) => updateSetting('shuffleQuestions', v)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  প্রশ্নের ক্রম এলোমেলো করে দেবে।
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">অপশন শাফল করুন</Label>
                  <Switch
                    checked={settings.shuffleOptions}
                    onCheckedChange={(v) => updateSetting('shuffleOptions', v)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  প্রতিটি প্রশ্নের অপশনগুলো এলোমেলো করে দেবে।
                </p>
              </div>

              <Separator className="my-2" />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">পুনরাবৃত্ত প্রশ্ন শনাক্ত</Label>
                  <Switch
                    checked={settings.detectDuplicates}
                    onCheckedChange={(v) => updateSetting('detectDuplicates', v)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  একই প্রশ্ন একাধিকবার নির্বাচিত হলে হাইলাইট করবে।
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">সেট কোড তৈরী</Label>
                </div>
                <Switch
                  checked={settings.enableShuffle}
                  onCheckedChange={(v) => updateSetting('enableShuffle', v)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Branding */}
          <AccordionItem value="branding">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Stamp className="w-4 h-4" />
                ব্র্যান্ডিং
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">ঠিকানা দেখান</Label>
                <Switch
                  checked={settings.showAddress}
                  onCheckedChange={(v) => updateSetting('showAddress', v)}
                />
              </div>
              {settings.showAddress && (
                <Input
                  placeholder="প্রতিষ্ঠানের ঠিকানা লিখুন"
                  value={settings.address}
                  onChange={(e) => updateSetting('address', e.target.value)}
                />
              )}

              <div className="flex items-center justify-between">
                <Label className="text-sm">জলছাপ দেখান</Label>
                <Switch
                  checked={settings.showWatermark}
                  onCheckedChange={(v) => updateSetting('showWatermark', v)}
                />
              </div>
              {settings.showWatermark && (
                <Input
                  placeholder="জলছাপ টেক্সট লিখুন"
                  value={settings.watermark}
                  onChange={(e) => updateSetting('watermark', e.target.value)}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default SettingsSidebar;
