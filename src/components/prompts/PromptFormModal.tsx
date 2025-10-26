import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { VariableEditor } from './VariableEditor';
import { PromptCategory, PromptVariable } from '../../types';

interface PromptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isSubmitting: boolean;
  variables: PromptVariable[];
  onAddVariable: () => void;
  onRemoveVariable: (index: number) => void;
  onUpdateVariable: (index: number, field: keyof PromptVariable, value: any) => void;
  submitButtonText?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const PromptFormModal: React.FC<PromptFormModalProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  register,
  errors,
  isSubmitting,
  variables,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
  submitButtonText = 'Create Prompt',
  containerRef,
}) => {
  const categoryOptions = Object.values(PromptCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      containerRef={containerRef}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Title *"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message as string}
        />
        
        <Textarea
          label="Description"
          {...register('description')}
          error={errors.description?.message as string}
        />
        
        <Textarea
          label="Content *"
          rows={8}
          placeholder="Enter your prompt template. Use {{variableName}} for dynamic variables."
          {...register('content', { required: 'Content is required' })}
          error={errors.content?.message as string}
        />
        
        <Select
          label="Category *"
          options={categoryOptions}
          {...register('category', { required: 'Category is required' })}
          error={errors.category?.message as string}
        />
        
        <Input
          label="Tags (comma-separated)"
          {...register('tags')}
          error={errors.tags?.message as string}
          placeholder="e.g., creative, problem-solving, analysis"
        />

        <VariableEditor
          variables={variables}
          onAdd={onAddVariable}
          onRemove={onRemoveVariable}
          onUpdate={onUpdateVariable}
        />
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`isPublic-${title}`}
            {...register('isPublic')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor={`isPublic-${title}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
            Make this prompt public
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
