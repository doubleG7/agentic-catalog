import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Prompt } from '../../types';
import { PromptCard } from './PromptCard';

interface PromptsGridProps {
  prompts: Prompt[];
  onView: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
  onCreateClick: () => void;
  gridRef?: React.RefObject<HTMLDivElement>;
}

export const PromptsGrid: React.FC<PromptsGridProps> = ({
  prompts,
  onView,
  onEdit,
  onDelete,
  onRatingChange,
  onCreateClick,
  gridRef
}) => {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          No prompts found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first prompt template.
        </p>
        <div className="mt-6">
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={{ y: -5 }}
        >
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onRatingChange={onRatingChange}
          />
        </motion.div>
      ))}
    </div>
  );
};
