import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCategoryStore } from '../store/useCategoryStore';

interface BrowseCategoriesProps {
  onClose?: () => void;
}

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({ onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('instructions');
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const { instructionCategories, promptCategories } = useCategoryStore();

  // Create query string with category filter
  const getCategoryUrl = (type: 'instructions' | 'prompts', category: string): string => {
    if (category === 'all') {
      return `/${type}`;
    }
    return `/${type}?category=${category}`;
  };

  // Calculate total counts
  const instructionTotal = instructionCategories.reduce((sum, cat) => sum + cat.count, 0);
  const promptTotal = promptCategories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <li>
      <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500">
        BROWSE CATEGORIES
      </div>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {/* Instructions Categories */}
        <li>
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === 'instructions' ? null : 'instructions'
              )
            }
            className="flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span>Instructions</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 opacity-50 transition-transform ${
                expandedSection === 'instructions' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSection === 'instructions' && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 overflow-hidden space-y-1"
              >
                <li>
                  <Link
                    to={getCategoryUrl('instructions', 'all')}
                    className={`flex items-center justify-between rounded-md py-1 px-2 text-sm ${
                      currentCategory === 'all'
                        ? 'text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={onClose}
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {instructionTotal}
                    </span>
                  </Link>
                </li>
                {instructionCategories.map((catStats) => (
                  <li key={catStats.category}>
                    <Link
                      to={getCategoryUrl('instructions', catStats.category)}
                      className={`flex items-center justify-between rounded-md py-1 px-2 text-sm ${
                        currentCategory === catStats.category
                          ? 'text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                      onClick={onClose}
                    >
                      <span>{catStats.displayName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {catStats.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* Prompts Categories */}
        <li>
          <button
            onClick={() =>
              setExpandedSection(expandedSection === 'prompts' ? null : 'prompts')
            }
            className="flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span>Prompts</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 opacity-50 transition-transform ${
                expandedSection === 'prompts' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedSection === 'prompts' && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 overflow-hidden space-y-1"
              >
                <li>
                  <Link
                    to={getCategoryUrl('prompts', 'all')}
                    className={`flex items-center justify-between rounded-md py-1 px-2 text-sm ${
                      currentCategory === 'all'
                        ? 'text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={onClose}
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {promptTotal}
                    </span>
                  </Link>
                </li>
                {promptCategories.map((catStats) => (
                  <li key={catStats.category}>
                    <Link
                      to={getCategoryUrl('prompts', catStats.category)}
                      className={`flex items-center justify-between rounded-md py-1 px-2 text-sm ${
                        currentCategory === catStats.category
                          ? 'text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                      onClick={onClose}
                    >
                      <span>{catStats.displayName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {catStats.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </li>
  );
};
