import React from 'react';
import { Star, Clock, Settings, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Instruction } from '../../types';

interface InstructionCardProps {
  instruction: Instruction;
  onView: (instruction: Instruction) => void;
  onEdit: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({
  instruction,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {instruction.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {instruction.description}
          </p>
        </div>
        {instruction.isPublic && (
          <Star className="h-5 w-5 text-yellow-400 ml-2" />
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {instruction.category.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(instruction.updatedAt).toLocaleDateString()}
            </div>
            {instruction.variables && instruction.variables.length > 0 && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Settings className="h-3 w-3 mr-1" />
                {instruction.variables.length} variables
              </div>
            )}
          </div>
          {instruction.metadata?.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              instruction.metadata.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              instruction.metadata.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {instruction.metadata.difficulty}
            </span>
          )}
        </div>

        {instruction.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {instruction.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {instruction.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{instruction.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-2">
                    <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView(instruction)}
            className="h-7 px-2 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(instruction)}
            className="h-7 px-2 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(instruction.id)}
            className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};