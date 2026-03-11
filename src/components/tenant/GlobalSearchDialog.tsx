import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, ClipboardList, Users, ArrowRight, X } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockBatches, mockExams } from '@/lib/tenant-mock-data';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'student' | 'exam' | 'batch';
  route: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearchDialog: React.FC<GlobalSearchDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const matched: SearchResult[] = [];

    // Search students
    mockStudents.forEach((s) => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.batchName?.toLowerCase().includes(q)
      ) {
        matched.push({
          id: `student-${s.id}`,
          title: s.name,
          subtitle: `${s.studentId} · ${s.className}${s.batchName ? ` · ${s.batchName}` : ''}`,
          category: 'student',
          route: `/tenant/students/${s.id}`,
          badge: s.isActive ? 'Active' : 'Inactive',
          badgeVariant: s.isActive ? 'default' : 'destructive',
        });
      }
    });

    // Search exams
    mockExams.forEach((e) => {
      if (
        e.title.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.batchName?.toLowerCase().includes(q)
      ) {
        matched.push({
          id: `exam-${e.id}`,
          title: e.title,
          subtitle: `${e.type} · ${e.totalMarks} marks · ${e.duration} min`,
          category: 'exam',
          route: `/tenant/exams/${e.id}`,
          badge: e.status,
          badgeVariant: e.status === 'Completed' ? 'secondary' : e.status === 'Ongoing' ? 'default' : 'outline',
        });
      }
    });

    // Search batches
    mockBatches.forEach((b) => {
      if (
        b.name.toLowerCase().includes(q) ||
        b.className.toLowerCase().includes(q) ||
        b.academicYear.toLowerCase().includes(q)
      ) {
        matched.push({
          id: `batch-${b.id}`,
          title: b.name,
          subtitle: `${b.className} · ${b.academicYear} · ${b.currentSize}/${b.capacity ?? '∞'} students`,
          category: 'batch',
          route: `/tenant/batches/${b.id}`,
          badge: b.isActive ? 'Active' : 'Inactive',
          badgeVariant: b.isActive ? 'default' : 'destructive',
        });
      }
    });

    return matched.slice(0, 20);
  }, [query]);

  const studentResults = results.filter((r) => r.category === 'student');
  const examResults = results.filter((r) => r.category === 'exam');
  const batchResults = results.filter((r) => r.category === 'batch');

  const handleSelect = useCallback(
    (route: string) => {
      onOpenChange(false);
      navigate(route);
    },
    [navigate, onOpenChange]
  );

  const categoryIcon = (cat: SearchResult['category']) => {
    switch (cat) {
      case 'student':
        return <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />;
      case 'exam':
        return <ClipboardList className="w-4 h-4 text-muted-foreground shrink-0" />;
      case 'batch':
        return <Users className="w-4 h-4 text-muted-foreground shrink-0" />;
    }
  };

  const renderItems = (items: SearchResult[]) =>
    items.map((item) => (
      <CommandItem
        key={item.id}
        value={item.id}
        onSelect={() => handleSelect(item.route)}
        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
      >
        {categoryIcon(item.category)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate text-sm">{item.title}</span>
            {item.badge && (
              <Badge variant={item.badgeVariant} className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                {item.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-data-[selected=true]:opacity-100" />
      </CommandItem>
    ));

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search students, exams, batches..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim() === '' ? (
          <div className="py-10 text-center">
            <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Start typing to search across your academy...</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Search by name, ID, class, batch, or exam title</p>
          </div>
        ) : (
          <>
            <CommandEmpty>
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
              </div>
            </CommandEmpty>

            {studentResults.length > 0 && (
              <CommandGroup heading={`Students (${studentResults.length})`}>
                {renderItems(studentResults)}
              </CommandGroup>
            )}

            {examResults.length > 0 && (
              <>
                {studentResults.length > 0 && <CommandSeparator />}
                <CommandGroup heading={`Exams (${examResults.length})`}>
                  {renderItems(examResults)}
                </CommandGroup>
              </>
            )}

            {batchResults.length > 0 && (
              <>
                {(studentResults.length > 0 || examResults.length > 0) && <CommandSeparator />}
                <CommandGroup heading={`Batches (${batchResults.length})`}>
                  {renderItems(batchResults)}
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearchDialog;
