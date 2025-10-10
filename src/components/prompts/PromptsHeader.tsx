import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface PromptsHeaderProps {
  onCreateClick: () => void;
}

export const PromptsHeader: React.FC<PromptsHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
          Prompts
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your prompt templates and AI instructions for various use cases.
        </p>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>
    </div>
  );
};
