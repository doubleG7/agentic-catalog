import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { 
  Instruction, 
  Prompt, 
  InstructionCategory,
  PromptCategory,
  UpdateInstructionRequest,
  UpdatePromptRequest,
  PromptVariable
} from '../../types';

interface EditModalsProps {
  // Instruction Modal Props
  isEditInstructionModalOpen: boolean;
  editingInstruction: Instruction | null;
  onCloseInstructionModal: () => void;
  onSubmitInstructionEdit: (data: any) => Promise<void>;
  
  // Prompt Modal Props
  isEditPromptModalOpen: boolean;
  editingPrompt: Prompt | null;
  onClosePromptModal: () => void;
  onSubmitPromptEdit: (data: any) => Promise<void>;
  
  // Variables management
  variables: PromptVariable[];
  setVariables: React.Dispatch<React.SetStateAction<PromptVariable[]>>;
}

export const EditModals: React.FC<EditModalsProps> = ({
  isEditInstructionModalOpen,
  editingInstruction,
  onCloseInstructionModal,
  onSubmitInstructionEdit,
  isEditPromptModalOpen,
  editingPrompt,
  onClosePromptModal,
  onSubmitPromptEdit,
  variables,
  setVariables,
}) => {
  // Form hooks for instruction editing
  const {
    register: registerInstructionEdit,
    handleSubmit: handleSubmitInstructionEdit,
    reset: resetInstructionEdit,
    setValue: setValueInstructionEdit,
    formState: { errors: errorsInstructionEdit, isSubmitting: isSubmittingInstructionEdit },
  } = useForm<UpdateInstructionRequest>();

  // Form hooks for prompt editing
  const {
    register: registerPromptEdit,
    handleSubmit: handleSubmitPromptEdit,
    reset: resetPromptEdit,
    setValue: setValuePromptEdit,
    formState: { errors: errorsPromptEdit, isSubmitting: isSubmittingPromptEdit },
  } = useForm<UpdatePromptRequest>();

  // Initialize form when editing instruction changes
  React.useEffect(() => {
    if (editingInstruction) {
      setValueInstructionEdit('title', editingInstruction.title);
      setValueInstructionEdit('description', editingInstruction.description);
      setValueInstructionEdit('content', editingInstruction.content);
      setValueInstructionEdit('category', editingInstruction.category);
      setValueInstructionEdit('tags', editingInstruction.tags);
      setValueInstructionEdit('isPublic', editingInstruction.isPublic);
    }
  }, [editingInstruction, setValueInstructionEdit]);

  // Initialize form when editing prompt changes
  React.useEffect(() => {
    if (editingPrompt) {
      setValuePromptEdit('title', editingPrompt.title);
      setValuePromptEdit('description', editingPrompt.description);
      setValuePromptEdit('content', editingPrompt.content);
      setValuePromptEdit('category', editingPrompt.category);
      setValuePromptEdit('tags', editingPrompt.tags.join(', ') as any);
      setValuePromptEdit('isPublic', editingPrompt.isPublic);
      setVariables(editingPrompt.variables || []);
    }
  }, [editingPrompt, setValuePromptEdit, setVariables]);

  // Variable management functions
  const addVariable = () => {
    setVariables([
      ...variables,
      {
        name: '',
        type: 'text',
        required: false,
        defaultValue: '',
        options: [],
      },
    ]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof PromptVariable, value: any) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const handleInstructionModalClose = () => {
    onCloseInstructionModal();
    resetInstructionEdit();
  };

  const handlePromptModalClose = () => {
    onClosePromptModal();
    resetPromptEdit();
    setVariables([]);
  };

  const instructionCategoryOptions = Object.values(InstructionCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  const promptCategoryOptions = Object.values(PromptCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  return (
    <>
      {/* Edit Instruction Modal */}
      <Modal
        isOpen={isEditInstructionModalOpen}
        onClose={handleInstructionModalClose}
        title="Edit Instruction"
        size="lg"
      >
        <form onSubmit={handleSubmitInstructionEdit(onSubmitInstructionEdit)} className="space-y-4">
          <Input
            label="Title *"
            {...registerInstructionEdit('title', { required: 'Title is required' })}
            error={errorsInstructionEdit.title?.message}
          />
          
          <Textarea
            label="Description"
            {...registerInstructionEdit('description')}
            error={errorsInstructionEdit.description?.message}
          />
          
          <Textarea
            label="Content *"
            rows={8}
            {...registerInstructionEdit('content', { required: 'Content is required' })}
            error={errorsInstructionEdit.content?.message}
          />
          
          <Select
            label="Category *"
            options={instructionCategoryOptions}
            {...registerInstructionEdit('category', { required: 'Category is required' })}
            error={errorsInstructionEdit.category?.message}
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublicInstructionEdit"
              {...registerInstructionEdit('isPublic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublicInstructionEdit" className="ml-2 block text-sm text-gray-900">
              Make this instruction public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleInstructionModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmittingInstructionEdit}>
              Update Instruction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Prompt Modal */}
      <Modal
        isOpen={isEditPromptModalOpen}
        onClose={handlePromptModalClose}
        title="Edit Prompt"
        size="lg"
      >
        <form onSubmit={handleSubmitPromptEdit(onSubmitPromptEdit)} className="space-y-4">
          <Input
            label="Title *"
            {...registerPromptEdit('title', { required: 'Title is required' })}
            error={errorsPromptEdit.title?.message}
          />
          
          <Textarea
            label="Description"
            {...registerPromptEdit('description')}
            error={errorsPromptEdit.description?.message}
          />
          
          <Textarea
            label="Content *"
            rows={8}
            placeholder="Enter your prompt template. Use {variableName} for dynamic variables."
            {...registerPromptEdit('content', { required: 'Content is required' })}
            error={errorsPromptEdit.content?.message}
          />
          
          <Select
            label="Category *"
            options={promptCategoryOptions}
            {...registerPromptEdit('category', { required: 'Category is required' })}
            error={errorsPromptEdit.category?.message}
          />
          
          <Input
            label="Tags (comma-separated)"
            {...registerPromptEdit('tags')}
            error={errorsPromptEdit.tags?.message}
            placeholder="e.g., creative, problem-solving, analysis"
          />

          {/* Variables Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Variables
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariable}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variable
              </Button>
            </div>
            
            {variables.map((variable, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Variable {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVariable(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Variable name"
                    value={variable.name}
                    onChange={(e) => updateVariable(index, 'name', e.target.value)}
                    className="input"
                  />
                  <select
                    value={variable.type}
                    onChange={(e) => updateVariable(index, 'type', e.target.value)}
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
                      onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Required</span>
                  </label>
                  
                  <input
                    type="text"
                    placeholder="Default value"
                    value={variable.defaultValue || ''}
                    onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                    className="input flex-1"
                  />
                </div>
                
                {variable.type === 'select' && (
                  <input
                    type="text"
                    placeholder="Options (comma-separated)"
                    value={variable.options?.join(', ') || ''}
                    onChange={(e) => updateVariable(index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                    className="input"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublicPromptEdit"
              {...registerPromptEdit('isPublic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublicPromptEdit" className="ml-2 block text-sm text-gray-900">
              Make this prompt public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePromptModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmittingPromptEdit}>
              Update Prompt
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};