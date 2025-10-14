import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PromptCard } from '../prompts/PromptCard';
import { Prompt } from '../../types';

interface PromptsPanelProps {
  prompts: Prompt[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onView: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onRatingChange?: (id: string, rating: number) => void;
}

export const PromptsPanel: React.FC<PromptsPanelProps> = ({
  prompts,
  loading,
  hasMore,
  onLoadMore,
  onView,
  onEdit,
  onDelete,
  onRatingChange,
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
            Recent Prompts
          </h3>
          <Link
            to="/prompts"
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all
          </Link>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:hover:scrollbar-thumb-gray-500"
        onScroll={handleScroll}
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="px-6 py-4">
              <PromptCard
                prompt={prompt}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onRatingChange={onRatingChange}
              />
            </div>
          ))}
          {loading && (
            <div className="px-6 py-4 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading more prompts...</span>
            </div>
          )}
          {!hasMore && prompts.length > 0 && (
            <div className="px-6 py-4 text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">No more prompts to load</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};