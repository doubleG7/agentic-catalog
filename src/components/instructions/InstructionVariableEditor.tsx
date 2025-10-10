import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { InstructionVariable } from '../../types';

interface InstructionVariableEditorProps {
  variables: InstructionVariable[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof InstructionVariable, value: any) => void;
}

export const InstructionVariableEditor: React.FC<InstructionVariableEditorProps> = ({
  variables,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Variables</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Variable
        </Button>
      </div>
      
      {variables.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No variables defined. Variables allow users to customize the instruction content.
        </p>
      ) : (
        <div className="space-y-3">
          {variables.map((variable, index) => (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Variable name"
                  value={variable.name}
                  onChange={(e) => onUpdate(index, 'name', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <select
                  value={variable.type}
                  onChange={(e) => onUpdate(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="select">Select</option>
                  <option value="file">File</option>
                  <option value="url">URL</option>
                </select>
              </div>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={variable.description || ''}
                  onChange={(e) => onUpdate(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={variable.required}
                      onChange={(e) => onUpdate(index, 'required', e.target.checked)}
                      className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    Required
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};