export interface PaperQuestion {
  id: string;
  number: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer?: string;
  context?: string;
  statements?: string[];
  type: 'single' | 'multiple' | 'assertion' | 'statement';
}

export interface PaperSettings {
  // Header settings
  institutionName: string;
  showClassName: boolean;
  showSubjectName: boolean;
  showChapterName: boolean;
  showSetCode: boolean;
  setCode: string;
  showExamName: boolean;
  examName: string;
  showInstructions: boolean;
  instructions: string;
  showTime: boolean;
  time: string;
  showTotalMarks: boolean;
  totalMarks: number;
  className: string;
  subjectName: string;
  chapterName: string;
  
  // Document customization
  paperSize: 'A4' | 'Letter' | 'Legal' | 'A5';
  optionStyle: 'parentheses' | 'dot' | 'bracket' | 'round';
  fontFamily: string;
  fontSize: number;
  columns: 1 | 2 | 3;
  showColumnDivider: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  
  // Additional tools
  detectDuplicates: boolean;
  enableShuffle: boolean;
  showAddress: boolean;
  address: string;
  showWatermark: boolean;
  watermark: string;
}

export interface PaperMetadata {
  className: string;
  subjectName: string;
  chapterName: string;
}
