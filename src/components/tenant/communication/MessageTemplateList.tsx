import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MessageTemplateCard from './MessageTemplateCard';
import {
  MessageTemplate,
  TemplateCategory,
  defaultTemplates,
  getCategoryDisplayName,
} from '@/lib/message-templates';

interface MessageTemplateListProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  selectedTemplateId?: string;
}

const categories: TemplateCategory[] = ['attendance', 'results', 'fees', 'exam', 'general'];

const MessageTemplateList: React.FC<MessageTemplateListProps> = ({
  onSelectTemplate,
  selectedTemplateId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');

  const filteredTemplates = defaultTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as TemplateCategory | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {getCategoryDisplayName(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Template</span>
        </Button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <MessageTemplateCard
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
            isSelected={selectedTemplateId === template.id}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No templates found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MessageTemplateList;
