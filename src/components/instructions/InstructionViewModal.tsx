import React from 'react';
import { Copy } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { InstructionExecutionForm } from '../InstructionExecutionForm';
import { Instruction } from '../../types';
import toast from 'react-hot-toast';

interface InstructionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruction: Instruction | null;
  isExecuted: boolean;
  executedTemplate: string;
  onExecute: (variableValues: Record<string, string>) => void;
  onReset: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const InstructionViewModal: React.FC<InstructionViewModalProps> = React.memo(({
  isOpen,
  onClose,
  instruction,
  isExecuted,
  executedTemplate,
  onExecute,
  onReset,
  containerRef,
}) => {
  // Don't render anything if no instruction
  if (!instruction) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(executedTemplate);
    toast.success('Copied to clipboard');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isExecuted ? 'Applied Instruction' : 'Apply Instruction'}
      size="xl"
      containerRef={containerRef}
    >
      {!isExecuted ? (
        <InstructionExecutionForm
          instruction={instruction}
          onExecute={onExecute}
          onCancel={onClose}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Applied Instruction: {instruction.title}
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
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
              {executedTemplate}
            </pre>
          </div>
        </div>
      )}
    </Modal>
  );
});

InstructionViewModal.displayName = 'InstructionViewModal';