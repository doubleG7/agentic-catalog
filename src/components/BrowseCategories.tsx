import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface BrowseCategoriesProps {
  instructionCategories: Array<{ name: string; count: number }>;
  promptCategories: Array<{ name: string; count: number }>;
  onClose?: () => void;
}

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({
  instructionCategories,
  promptCategories,
  onClose,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('instructions');

  return (
    <li>
      <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500">
        BROWSE CATEGORIES
      </div>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
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
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {instructionCategories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
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
                {instructionCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={`/instructions?category=${category.name.toLowerCase().replace(' ', '_')}`}
                      className="flex items-center justify-between rounded-md py-1 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                      onClick={onClose}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{category.count}</span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        <li>
          <button
            onClick={() =>
              setExpandedSection(expandedSection === 'prompts' ? null : 'prompts')
            }
            className="flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span>Prompts</span>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {promptCategories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
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
                {promptCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={`/prompts?category=${category.name.toLowerCase().replace(' ', '_')}`}
                      className="flex items-center justify-between rounded-md py-1 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                      onClick={onClose}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{category.count}</span>
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
