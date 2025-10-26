import React, { useState } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input, Textarea, Select } from './ui/Input';
import { Prompt, PromptVariable } from '../types';

interface PromptExecutionFormProps {
  prompt: Prompt;
  onExecute: (variableValues: Record<string, string>) => void;
  onCancel: () => void;
}

export const PromptExecutionForm: React.FC<PromptExecutionFormProps> = ({
  prompt,
  onExecute,
  onCancel,
}) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    prompt.variables?.forEach((variable) => {
      initialValues[variable.name] = variable.defaultValue || '';
    });
    return initialValues;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleVariableChange = (variableName: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [variableName]: value }));
    // Clear error when user starts typing
    if (errors[variableName]) {
      setErrors((prev) => ({ ...prev, [variableName]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    prompt.variables?.forEach((variable) => {
      if (variable.required && !variableValues[variable.name]?.trim()) {
        newErrors[variable.name] = `${variable.name} is required`;
      }
      
      if (variable.type === 'NUMBER' && variableValues[variable.name]) {
        const numValue = Number(variableValues[variable.name]);
        if (isNaN(numValue)) {
          newErrors[variable.name] = `${variable.name} must be a valid number`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExecute = () => {
    if (validateForm()) {
      onExecute(variableValues);
    }
  };

  const renderVariableInput = (variable: PromptVariable) => {
    const value = variableValues[variable.name] || '';
    const error = errors[variable.name];

    switch (variable.type) {
      case 'BOOLEAN':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={variable.name}
              checked={value === 'true'}
              onChange={(e) => handleVariableChange(variable.name, e.target.checked ? 'true' : 'false')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor={variable.name} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {variable.description || variable.name}
            </label>
          </div>
        );

      case 'SELECT':
        return (
          <Select
            label={`${variable.name}${variable.required ? ' *' : ''}`}
            value={value}
            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
            error={error}
            options={variable.options?.map(option => ({ value: option, label: option })) || []}
          />
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            label={`${variable.name}${variable.required ? ' *' : ''}`}
            value={value}
            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
            error={error}
            placeholder={variable.description || `Enter ${variable.name}`}
          />
        );

      default:
        return value.length > 100 || variable.name.toLowerCase().includes('description') ? (
          <Textarea
            label={`${variable.name}${variable.required ? ' *' : ''}`}
            value={value}
            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
            error={error}
            placeholder={variable.description || `Enter ${variable.name}`}
            rows={4}
          />
        ) : (
          <Input
            label={`${variable.name}${variable.required ? ' *' : ''}`}
            value={value}
            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
            error={error}
            placeholder={variable.description || `Enter ${variable.name}`}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Prompt Template:</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {prompt.content}
        </div>
      </div>

      {/* Variables Form */}
      {prompt.variables && prompt.variables.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fill in the variables:</h3>
          {prompt.variables.map((variable) => (
            <div key={variable.name} className="space-y-2">
              {renderVariableInput(variable)}
              {variable.description && variable.type !== 'BOOLEAN' && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{variable.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              This prompt has no variables. It will be executed as-is.
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleExecute} 
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white focus:font-bold focus:border-2 focus:border-green-500 dark:focus:border-green-400"
        >
          <Play className="h-4 w-4 mr-2" />
          Run Prompt
        </Button>
      </div>
    </div>
  );
};