import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { PromptVariable } from '../../types';

interface VariableEditorProps {
  variables: PromptVariable[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof PromptVariable, value: any) => void;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({
  variables,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Variables
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Variable
        </Button>
      </div>
      
      {variables.map((variable, index) => (
        <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Variable {index + 1}
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Variable name"
              value={variable.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              className="input"
            />
            <select
              value={variable.type}
              onChange={(e) => onUpdate(index, 'type', e.target.value)}
              className="input"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="select">Select</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={variable.required}
                onChange={(e) => onUpdate(index, 'required', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Required</span>
            </label>
            
            <input
              type="text"
              placeholder="Default value"
              value={variable.defaultValue || ''}
              onChange={(e) => onUpdate(index, 'defaultValue', e.target.value)}
              className="input flex-1"
            />
          </div>
          
          {variable.type === 'select' && (
            <input
              type="text"
              placeholder="Options (comma-separated)"
              value={variable.options?.join(', ') || ''}
              onChange={(e) => onUpdate(index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
              className="input"
            />
          )}
        </div>
      ))}
    </div>
  );
};
