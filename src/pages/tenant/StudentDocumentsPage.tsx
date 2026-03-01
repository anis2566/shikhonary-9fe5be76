import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  Download,
  Eye,
  Plus,
  FolderOpen,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { mockStudents } from '@/lib/tenant-mock-data';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: 'birth_certificate' | 'photo' | 'transcript' | 'transfer_certificate' | 'medical' | 'other';
  fileType: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

const mockDocuments: Document[] = [
  { id: 'doc-1', name: 'Birth Certificate.pdf', type: 'birth_certificate', fileType: 'pdf', size: '1.2 MB', uploadedAt: '2024-01-15T10:00:00Z', uploadedBy: 'Admin' },
  { id: 'doc-2', name: 'Passport Photo.jpg', type: 'photo', fileType: 'jpg', size: '450 KB', uploadedAt: '2024-01-15T10:05:00Z', uploadedBy: 'Admin' },
  { id: 'doc-3', name: 'Class 9 Transcript.pdf', type: 'transcript', fileType: 'pdf', size: '850 KB', uploadedAt: '2024-02-01T09:00:00Z', uploadedBy: 'Admin' },
  { id: 'doc-4', name: 'Medical Report.pdf', type: 'medical', fileType: 'pdf', size: '2.1 MB', uploadedAt: '2024-03-10T14:00:00Z', uploadedBy: 'Teacher' },
];

const typeLabels: Record<Document['type'], string> = {
  birth_certificate: 'Birth Certificate',
  photo: 'Photo',
  transcript: 'Transcript',
  transfer_certificate: 'Transfer Cert.',
  medical: 'Medical',
  other: 'Other',
};

const typeColors: Record<Document['type'], string> = {
  birth_certificate: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  photo: 'bg-green-500/10 text-green-600 border-green-500/20',
  transcript: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  transfer_certificate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  medical: 'bg-red-500/10 text-red-600 border-red-500/20',
  other: 'bg-muted text-muted-foreground',
};

const getFileIcon = (fileType: string) => {
  if (['jpg', 'jpeg', 'png', 'webp'].includes(fileType)) return Image;
  if (['pdf'].includes(fileType)) return FileText;
  return File;
};

const StudentDocumentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filterType, setFilterType] = useState<string>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [uploadType, setUploadType] = useState<Document['type']>('other');

  const student = mockStudents.find((s) => s.id === id);

  const filteredDocs = filterType === 'all' ? documents : documents.filter((d) => d.type === filterType);

  const handleUpload = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: `New Document.pdf`,
      type: uploadType,
      fileType: 'pdf',
      size: '500 KB',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'You',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setShowUploadDialog(false);
    toast.success('Document uploaded successfully');
  };

  const handleDelete = () => {
    if (deleteDoc) {
      setDocuments((prev) => prev.filter((d) => d.id !== deleteDoc.id));
      setDeleteDoc(null);
      toast.success('Document deleted');
    }
  };

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="font-medium">Student not found</p>
        <Button onClick={() => navigate('/tenant/students')} className="mt-4">Back to Students</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/tenant/students">Students</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/tenant/students/${id}`}>{student.name}</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Documents</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground text-sm">{student.name} — {documents.length} document(s)</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(typeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const FileIcon = getFileIcon(doc.fileType);
            return (
              <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-muted">
                      <FileIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[10px] ${typeColors[doc.type]}`}>
                          {typeLabels[doc.type]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success('Previewing...')}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success('Downloading...')}>
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteDoc(doc)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-medium">No documents found</p>
            <p className="text-sm text-muted-foreground mb-4">Upload documents to get started</p>
            <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload First Document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <AlertDialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upload Document</AlertDialogTitle>
            <AlertDialogDescription>
              Upload a document for {student.name}. Select the document type and file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Document Type</label>
              <Select value={uploadType} onValueChange={(v) => setUploadType(v as Document['type'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">File</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpload}>Upload</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteDoc} onOpenChange={() => setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteDoc?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentDocumentsPage;
