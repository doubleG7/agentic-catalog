import React from 'react';
import { Clock, Settings, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { RatingDisplay } from '../ui/RatingDisplay';
import { StarRating } from '../ui/StarRating';
import { Instruction } from '../../types';

interface InstructionCardProps {
  instruction: Instruction;
  onView: (instruction: Instruction) => void;
  onEdit: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({
  instruction,
  onView,
  onEdit,
  onDelete,
  onRatingChange,
}) => {
  const handleRatingSubmit = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(instruction.id, rating);
    }
  };
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            <button
              onClick={() => onView(instruction)}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors text-left"
            >
              {instruction.title}
            </button>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {instruction.description}
          </p>
        </div>
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
              instruction.metadata.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              instruction.metadata.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
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

      {/* Action Buttons */}
      <div className="mt-6">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView(instruction)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(instruction)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(instruction.id)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-red-500 dark:focus:border-red-400"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          {onRatingChange && instruction.rating ? (
            <div className="flex items-center space-x-2">
              <StarRating
                rating={instruction.rating.userRating || instruction.rating.average || 0}
                onRatingChange={handleRatingSubmit}
                size="sm"
              />
              {instruction.rating.count > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({instruction.rating.count})
                </span>
              )}
            </div>
          ) : instruction.rating ? (
            <RatingDisplay
              rating={instruction.rating.average}
              totalRatings={instruction.rating.count}
              size="sm"
              showCount
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};