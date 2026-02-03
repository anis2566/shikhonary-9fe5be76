import React from 'react';
import { Users, Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { mockBatches } from '@/lib/tenant-mock-data';

interface StepBatchSelectionProps {
  data: {
    batchIds: string[];
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string[]) => void;
}

const StepBatchSelection: React.FC<StepBatchSelectionProps> = ({
  data,
  errors,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredBatches = mockBatches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group batches by class
  const batchesByClass = filteredBatches.reduce((acc, batch) => {
    if (!acc[batch.className]) {
      acc[batch.className] = [];
    }
    acc[batch.className].push(batch);
    return acc;
  }, {} as Record<string, typeof mockBatches>);

  const toggleBatch = (batchId: string) => {
    const newBatchIds = data.batchIds.includes(batchId)
      ? data.batchIds.filter((id) => id !== batchId)
      : [...data.batchIds, batchId];
    onChange('batchIds', newBatchIds);
  };

  const toggleClass = (className: string, batches: typeof mockBatches) => {
    const classBatchIds = batches.map((b) => b.id);
    const allSelected = classBatchIds.every((id) => data.batchIds.includes(id));

    if (allSelected) {
      onChange(
        'batchIds',
        data.batchIds.filter((id) => !classBatchIds.includes(id))
      );
    } else {
      const newBatchIds = [...new Set([...data.batchIds, ...classBatchIds])];
      onChange('batchIds', newBatchIds);
    }
  };

  const selectAll = () => {
    onChange(
      'batchIds',
      mockBatches.map((b) => b.id)
    );
  };

  const clearAll = () => {
    onChange('batchIds', []);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Select Batches</h2>
        <p className="text-sm text-muted-foreground">
          Choose which batches will take this exam
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            Select All
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear All
          </button>
        </div>
      </div>

      {data.batchIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Selected:</span>
          {data.batchIds.map((id) => {
            const batch = mockBatches.find((b) => b.id === id);
            return batch ? (
              <Badge
                key={id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleBatch(id)}
              >
                {batch.name} - {batch.className}
                <span className="ml-1 text-muted-foreground">×</span>
              </Badge>
            ) : null;
          })}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(batchesByClass).map(([className, batches]) => {
          const classBatchIds = batches.map((b) => b.id);
          const selectedCount = classBatchIds.filter((id) =>
            data.batchIds.includes(id)
          ).length;
          const allSelected = selectedCount === batches.length;
          const someSelected = selectedCount > 0 && !allSelected;

          return (
            <div key={className} className="border rounded-lg overflow-hidden">
              <div
                className={cn(
                  'flex items-center justify-between p-3 bg-muted/50 cursor-pointer',
                  'hover:bg-muted transition-colors'
                )}
                onClick={() => toggleClass(className, batches)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={allSelected}
                    className={cn(someSelected && 'data-[state=checked]:bg-primary/50')}
                  />
                  <span className="font-medium">{className}</span>
                  <Badge variant="outline" className="text-xs">
                    {batches.length} {batches.length === 1 ? 'batch' : 'batches'}
                  </Badge>
                </div>
                {selectedCount > 0 && (
                  <span className="text-sm text-primary">
                    {selectedCount} selected
                  </span>
                )}
              </div>

              <div className="divide-y">
                {batches.map((batch) => {
                  const isSelected = data.batchIds.includes(batch.id);

                  return (
                    <div
                      key={batch.id}
                      className={cn(
                        'flex items-center justify-between p-3 cursor-pointer transition-colors',
                        isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                      )}
                      onClick={() => toggleBatch(batch.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isSelected} />
                        <div>
                          <p className="font-medium text-sm">{batch.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {batch.academicYear} • {batch.currentSize}/{batch.capacity} students
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{batch.currentSize}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {errors.batchIds && (
        <p className="text-sm text-destructive">{errors.batchIds}</p>
      )}
    </div>
  );
};

export default StepBatchSelection;
