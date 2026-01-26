import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ListPageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
}

const ListPageHeader: React.FC<ListPageHeaderProps> = ({ title, subtitle, backUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-3">
          {backUrl && (
            <Button variant="ghost" size="icon" onClick={() => navigate(backUrl)} className="shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPageHeader;
