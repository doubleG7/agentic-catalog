import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Edit, Trash2, Loader2, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Prompt } from '../../types';

interface PromptsPanelProps {
  prompts: Prompt[];
  loading: boolean;
  hasMore: boolean;
  favoritePrompts: Set<string>;
  onLoadMore: () => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const PromptsPanel: React.FC<PromptsPanelProps> = ({
  prompts,
  loading,
  hasMore,
  favoritePrompts,
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
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Prompts
          </h3>
          <Link
            to="/prompts"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
        onScroll={handleScroll}
      >
        <div className="divide-y divide-gray-200">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/prompts/${prompt.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-600"
                  >
                    {prompt.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {prompt.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {prompt.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(prompt.updatedAt).toLocaleDateString()}
                    </div>
                    {prompt.variables && prompt.variables.length > 0 && (
                      <div className="flex items-center">
                        <Settings className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="text-xs text-blue-600">
                          {prompt.variables.length} var{prompt.variables.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {prompt.isPublic && (
                      <div className="flex items-center text-xs text-green-600">
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
                        onEdit(prompt);
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
                        onDelete(prompt.id);
                      }}
                      className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
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
                    onToggleFavorite(prompt.id);
                  }}
                  className="h-10 w-10 p-0 text-gray-400 hover:text-yellow-500"
                >
                  <Star className={`h-6 w-6 ${favoritePrompts.has(prompt.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </div>
            </div>
          ))}
          {loading && (
            <div className="px-6 py-4 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600 mr-2" />
              <span className="text-sm text-gray-500">Loading more prompts...</span>
            </div>
          )}
          {!hasMore && prompts.length > 0 && (
            <div className="px-6 py-4 text-center">
              <span className="text-sm text-gray-500">No more prompts to load</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};