import React from 'react';
import { Copy } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PromptExecutionForm } from '../PromptExecutionForm';
import { Prompt } from '../../types';
import toast from 'react-hot-toast';

interface PromptViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
  isExecuted: boolean;
  executedTemplate: string;
  onExecute: (variableValues: Record<string, string>) => void;
  onReset: () => void;
}

export const PromptViewModal: React.FC<PromptViewModalProps> = React.memo(({
  isOpen,
  onClose,
  prompt,
  isExecuted,
  executedTemplate,
  onExecute,
  onReset,
}) => {
  // Don't render anything if no prompt
  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(executedTemplate);
    toast.success('Copied to clipboard');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isExecuted ? 'Executed Prompt' : 'Execute Prompt'}
      size="xl"
    >
      {!isExecuted ? (
        <PromptExecutionForm
          prompt={prompt}
          onExecute={onExecute}
          onCancel={onClose}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Generated Output for: {prompt.title}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={onReset}
                className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
              >
                Edit Variables
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-128 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
              {executedTemplate}
            </pre>
          </div>
        </div>
      )}
    </Modal>
  );
});

PromptViewModal.displayName = 'PromptViewModal';
