import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, RotateCcw, Edit, Eye, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import PaperPreview from '@/components/tenant/question-paper/PaperPreview';
import SettingsSidebar from '@/components/tenant/question-paper/SettingsSidebar';
import { PaperQuestion, PaperSettings } from '@/components/tenant/question-paper/types';
import {
  mockPaperQuestions,
  defaultPaperSettings,
} from '@/lib/question-paper-mock-data';

const QuestionPaperBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PaperQuestion[]>(mockPaperQuestions);
  const [settings, setSettings] = useState<PaperSettings>(defaultPaperSettings);
  const [isEditing, setIsEditing] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState<number | 'auto'>('auto');

  const handleUpdateQuestion = useCallback((updatedQuestion: PaperQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }, []);

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== id);
      // Renumber questions
      return filtered.map((q, idx) => ({ ...q, number: idx + 1 }));
    });
    toast.success('Question deleted');
  }, []);

  const handleDuplicateQuestion = useCallback((question: PaperQuestion) => {
    const newQuestion: PaperQuestion = {
      ...question,
      id: `pq-${Date.now()}`,
      number: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    toast.success('Question duplicated');
  }, [questions.length]);

  const handleAddQuestion = useCallback(() => {
    const newQuestion: PaperQuestion = {
      id: `pq-${Date.now()}`,
      number: questions.length + 1,
      question: 'নতুন প্রশ্ন লিখুন...',
      options: [
        { label: 'ক', text: 'অপশন ১' },
        { label: 'খ', text: 'অপশন ২' },
        { label: 'গ', text: 'অপশন ৩' },
        { label: 'ঘ', text: 'অপশন ৪' },
      ],
      type: 'single',
    };
    setQuestions((prev) => [...prev, newQuestion]);
    toast.success('New question added');
  }, [questions.length]);

  const handleResetQuestions = useCallback(() => {
    setQuestions(mockPaperQuestions);
    setSettings(defaultPaperSettings);
    toast.success('Reset to default');
  }, []);

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('paper-preview');
      if (!element) {
        throw new Error('Preview element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: settings.paperSize.toLowerCase() as 'a4' | 'letter' | 'legal',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`question-paper-${Date.now()}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  }, [settings.paperSize]);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/tenant')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Question Paper Builder</h1>
              <p className="text-sm text-muted-foreground">
                Create and customize your question paper
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{questions.length} Questions</Badge>
            <Toggle
              pressed={isEditing}
              onPressedChange={setIsEditing}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Editing</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              )}
            </Toggle>
            <Button variant="outline" size="sm" onClick={handleResetQuestions}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Paper Preview Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-2 p-2 bg-background border-b">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(prev => typeof prev === 'number' ? Math.max(0.25, prev - 0.1) : 0.5)}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">
              {zoom === 'auto' ? 'Auto' : `${Math.round(zoom * 100)}%`}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(prev => typeof prev === 'number' ? Math.min(2, prev + 0.1) : 0.7)}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => setZoom('auto')}
            >
              <Maximize2 className="w-3 h-3" />
              Fit
            </Button>
          </div>
          
          {/* Paper Preview */}
          <div className="flex-1 bg-muted/50 overflow-auto">
            <PaperPreview
              questions={questions}
              settings={settings}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onDuplicateQuestion={handleDuplicateQuestion}
              onSettingsChange={setSettings}
              isEditing={isEditing}
              zoom={zoom}
            />
          </div>
        </div>

        {/* Settings Sidebar */}
        <SettingsSidebar
          settings={settings}
          onSettingsChange={setSettings}
          onExportPdf={handleExportPdf}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
};

export default QuestionPaperBuilder;
