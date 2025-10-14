import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { instructionsApi } from '../api/services';
import { 
  Instruction,
  CreateInstructionRequest,
  UpdateInstructionRequest,
  InstructionVariable
} from '../types';
import { useAppStore, useFilteredInstructions } from '../store/useAppStore';
import {
  InstructionsHeader,
  InstructionsFilters,
  InstructionsGrid,
  InstructionFormModal,
  InstructionViewModal,
} from '../components/instructions';
import toast from 'react-hot-toast';

const Instructions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const instructions = useFilteredInstructions();
  const {
    instructionsLoading,
    setInstructions,
    setInstructionsLoading,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
  } = useAppStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [variables, setVariables] = useState<InstructionVariable[]>([]);
  const [editVariables, setEditVariables] = useState<InstructionVariable[]>([]);
  const [viewingInstruction, setViewingInstruction] = useState<Instruction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [executedTemplate, setExecutedTemplate] = useState<string>('');
  const [isExecuted, setIsExecuted] = useState(false);

  interface ExtendedCreateInstructionForm extends CreateInstructionRequest {
    author?: string;
    version?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    prerequisites?: string;
    outputs?: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExtendedCreateInstructionForm>();

  interface ExtendedInstructionForm extends UpdateInstructionRequest {
    author?: string;
    version?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    prerequisites?: string;
    outputs?: string;
  }

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<ExtendedInstructionForm>();

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
        description: '',
      },
    ]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof InstructionVariable, value: any) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const addEditVariable = () => {
    setEditVariables([
      ...editVariables,
      {
        name: '',
        type: 'text',
        required: false,
        defaultValue: '',
        options: [],
        description: '',
      },
    ]);
  };

  const removeEditVariable = (index: number) => {
    setEditVariables(editVariables.filter((_, i) => i !== index));
  };

  const updateEditVariable = (index: number, field: keyof InstructionVariable, value: any) => {
    const updated = [...editVariables];
    updated[index] = { ...updated[index], [field]: value };
    setEditVariables(updated);
  };

  useEffect(() => {
    fetchInstructions();
  }, [searchParams]);

  const fetchInstructions = async () => {
    try {
      setInstructionsLoading(true);
      const params = {
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        page: 1,
        limit: 20,
      };
      const response = await instructionsApi.getAll(params);
      setInstructions(response.data);
    } catch (error) {
      toast.error('Failed to fetch instructions');
    } finally {
      setInstructionsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newSearchParams = new URLSearchParams(searchParams);
    if (query) {
      newSearchParams.set('search', query);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    const newSearchParams = new URLSearchParams(searchParams);
    if (category) {
      newSearchParams.set('category', category);
    } else {
      newSearchParams.delete('category');
    }
    setSearchParams(newSearchParams);
  };

  const onCreateSubmit = async (data: any) => {
    try {
      const tagsArray = data.tags && typeof data.tags === 'string' 
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : Array.isArray(data.tags) ? data.tags : [];
      
      const prerequisitesArray = data.prerequisites && typeof data.prerequisites === 'string'
        ? data.prerequisites.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [];
        
      const outputsArray = data.outputs && typeof data.outputs === 'string'
        ? data.outputs.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [];
        
      const instructionData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        isPublic: data.isPublic || false,
        variables,
        tags: tagsArray,
        relatedInstructions: [],
        metadata: {
          author: data.author || '',
          version: data.version || '1.0',
          difficulty: data.difficulty || 'beginner',
          estimatedTime: data.estimatedTime ? parseInt(data.estimatedTime) : undefined,
          prerequisites: prerequisitesArray,
          outputs: outputsArray,
        }
      };
      
      await instructionsApi.create(instructionData);
      toast.success('Instruction created successfully');
      setIsCreateModalOpen(false);
      reset();
      setVariables([]);
      fetchInstructions();
    } catch (error) {
      toast.error('Failed to create instruction');
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!editingInstruction) return;
    
    try {
      const tagsArray = data.tags && typeof data.tags === 'string' 
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : Array.isArray(data.tags) ? data.tags : editingInstruction.tags;
      
      const prerequisitesArray = data.prerequisites && typeof data.prerequisites === 'string'
        ? data.prerequisites.split(',').map((item: string) => item.trim()).filter(Boolean)
        : editingInstruction.metadata?.prerequisites || [];
        
      const outputsArray = data.outputs && typeof data.outputs === 'string'
        ? data.outputs.split(',').map((item: string) => item.trim()).filter(Boolean)
        : editingInstruction.metadata?.outputs || [];
        
      const instructionData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        isPublic: data.isPublic,
        variables: editVariables,
        tags: tagsArray,
        relatedInstructions: editingInstruction.relatedInstructions,
        metadata: {
          author: data.author || editingInstruction.metadata?.author || '',
          version: data.version || editingInstruction.metadata?.version || '1.0',
          difficulty: data.difficulty || editingInstruction.metadata?.difficulty || 'beginner',
          estimatedTime: data.estimatedTime ? parseInt(data.estimatedTime) : editingInstruction.metadata?.estimatedTime,
          prerequisites: prerequisitesArray,
          outputs: outputsArray,
        }
      };
      
      await instructionsApi.update(editingInstruction.id, instructionData);
      toast.success('Instruction updated successfully');
      setIsEditModalOpen(false);
      setEditingInstruction(null);
      resetEdit();
      setEditVariables([]);
      fetchInstructions();
    } catch (error) {
      toast.error('Failed to update instruction');
    }
  };

  const handleEdit = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setValueEdit('title', instruction.title);
    setValueEdit('description', instruction.description);
    setValueEdit('content', instruction.content);
    setValueEdit('category', instruction.category);
    setValueEdit('tags', instruction.tags.join(', ') as any);
    setValueEdit('isPublic', instruction.isPublic);
    
    // Set metadata fields
    setValueEdit('author', instruction.metadata?.author || '');
    setValueEdit('version', instruction.metadata?.version || '1.0');
    setValueEdit('difficulty', instruction.metadata?.difficulty || 'beginner');
    setValueEdit('estimatedTime', instruction.metadata?.estimatedTime?.toString() || '');
    setValueEdit('prerequisites', instruction.metadata?.prerequisites?.join(', ') || '');
    setValueEdit('outputs', instruction.metadata?.outputs?.join(', ') || '');
    
    setEditVariables(instruction.variables || []);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instruction?')) return;
    
    try {
      await instructionsApi.delete(id);
      toast.success('Instruction deleted successfully');
      fetchInstructions();
    } catch (error) {
      toast.error('Failed to delete instruction');
    }
  };

  const handleRating = (id: string, rating: number) => {
    // Update the instruction's rating in the local state
    const updatedInstructions = instructions.map(instruction => 
      instruction.id === id 
        ? {
            ...instruction,
            rating: {
              average: rating, // In a real app, this would be calculated server-side
              count: (instruction.rating?.count || 0) + 1,
              userRating: rating
            }
          }
        : instruction
    );
    setInstructions(updatedInstructions);
    toast.success('Rating submitted successfully');
  };

  const handleView = (instruction: Instruction) => {
    // Batch state updates to prevent flashing
    setViewingInstruction(instruction);
    setIsExecuted(false);
    setExecutedTemplate('');
    // Open modal after setting initial state
    requestAnimationFrame(() => {
      setIsViewModalOpen(true);
    });
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    // Clear state after modal close animation
    setTimeout(() => {
      setViewingInstruction(null);
      setIsExecuted(false);
      setExecutedTemplate('');
    }, 200); // Match modal exit animation duration
  };

  const handleExecuteInstruction = (variableValues: Record<string, string>) => {
    if (!viewingInstruction) return;
    
    let processedTemplate = viewingInstruction.content;
    
    // Replace variables in the template
    viewingInstruction.variables?.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || '';
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });
    
    setExecutedTemplate(processedTemplate);
    setIsExecuted(true);
  };

  if (instructionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstructionsHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      
      <InstructionsFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryFilter}
      />

      <InstructionsGrid
        instructions={instructions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRatingChange={handleRating}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      <InstructionFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setVariables([]);
          reset();
        }}
        title="Create New Instruction"
        onSubmit={handleSubmit(onCreateSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        variables={variables}
        onAddVariable={addVariable}
        onRemoveVariable={removeVariable}
        onUpdateVariable={updateVariable}
        submitButtonText="Create Instruction"
      />

      {/* Edit Modal */}
      <InstructionFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditVariables([]);
          setEditingInstruction(null);
          resetEdit();
        }}
        title="Edit Instruction"
        onSubmit={handleSubmitEdit(onEditSubmit)}
        register={registerEdit}
        errors={errorsEdit}
        isSubmitting={isSubmittingEdit}
        variables={editVariables}
        onAddVariable={addEditVariable}
        onRemoveVariable={removeEditVariable}
        onUpdateVariable={updateEditVariable}
        submitButtonText="Update Instruction"
      />

      {/* View/Execute Modal */}
      <InstructionViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        instruction={viewingInstruction}
        isExecuted={isExecuted}
        executedTemplate={executedTemplate}
        onExecute={handleExecuteInstruction}
        onReset={() => setIsExecuted(false)}
      />
    </div>
  );
};

export default Instructions;