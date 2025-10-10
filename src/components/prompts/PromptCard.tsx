import React from 'react';
import { Star, Clock, Settings, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Prompt } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
  onView: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {prompt.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {prompt.description}
          </p>
        </div>
        {prompt.isPublic && (
          <Star className="h-5 w-5 text-yellow-400 ml-2" />
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {prompt.category.replace(/_/g, ' ')}
          </span>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(prompt.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {prompt.variables && prompt.variables.length > 0 && (
          <div className="mt-2 flex items-center">
            <Settings className="h-3 w-3 text-blue-500 mr-1" />
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {prompt.variables.length} variable{prompt.variables.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {prompt.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{prompt.tags.length - 3} more
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
            onClick={() => onView(prompt)}
            className="h-7 px-2 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(prompt)}
            className="h-7 px-2 text-xs border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(prompt.id)}
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
