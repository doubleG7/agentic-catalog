import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Instruction } from '../../types';
import { InstructionCard } from './InstructionCard';

interface InstructionsGridProps {
  instructions: Instruction[];
  onView: (instruction: Instruction) => void;
  onEdit: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
  onCreateClick: () => void;
}

export const InstructionsGrid: React.FC<InstructionsGridProps> = ({
  instructions,
  onView,
  onEdit,
  onDelete,
  onRatingChange,
  onCreateClick,
}) => {
  if (instructions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          No instructions found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first instruction.
        </p>
        <div className="mt-6">
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            New Instruction
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {instructions.map((instruction) => (
        <InstructionCard
          key={instruction.id}
          instruction={instruction}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onRatingChange={onRatingChange}
        />
      ))}
    </div>
  );
};