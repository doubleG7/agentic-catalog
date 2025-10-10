import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Instruction } from '../../types';

interface InstructionsPanelProps {
  instructions: Instruction[];
  loading: boolean;
  hasMore: boolean;
  favoriteInstructions: Set<string>;
  onLoadMore: () => void;
  onEdit: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({
  instructions,
  loading,
  hasMore,
  favoriteInstructions,
  onLoadMore,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      onLoadMore();
    }
  }, [onLoadMore]);

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Recent Instructions
          </h3>
          <Link
            to="/instructions"
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all
          </Link>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:hover:scrollbar-thumb-gray-500"
        onScroll={handleScroll}
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {instructions.map((instruction) => (
            <div key={instruction.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/instructions/${instruction.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                  >
                    {instruction.title}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {instruction.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {instruction.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(instruction.updatedAt).toLocaleDateString()}
                    </div>
                    {instruction.isPublic && (
                      <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <Star className="h-3 w-3 mr-1" />
                        Public
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-3 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(instruction);
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(instruction.id);
                      }}
                      className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300 dark:hover:border-red-500"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(instruction.id);
                  }}
                  className="h-10 w-10 p-0 text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
                >
                  <Star className={`h-6 w-6 ${favoriteInstructions.has(instruction.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </div>
            </div>
          ))}
          {loading && (
            <div className="px-6 py-4 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading more instructions...</span>
            </div>
          )}
          {!hasMore && instructions.length > 0 && (
            <div className="px-6 py-4 text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">No more instructions to load</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};