import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkComplete: () => void;
  onBulkActive: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkDelete, 
  onBulkComplete,
  onBulkActive
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-primary text-primary-foreground shadow-2xl rounded-2xl flex items-center gap-6"
        >
          <div className="flex items-center gap-2 border-r border-primary-foreground/20 pr-6">
            <span className="text-sm font-bold bg-primary-foreground/20 px-2 py-0.5 rounded-full">{selectedCount}</span>
            <span className="text-sm font-medium whitespace-nowrap">Tasks selected</span>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onBulkComplete}
              className="h-9 px-4 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onBulkActive}
              className="h-9 px-4 rounded-full bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 font-bold"
            >
              Active
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onBulkDelete}
              className="h-9 px-4 rounded-full font-bold shadow-lg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>

          <button 
            onClick={onClearSelection}
            className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
