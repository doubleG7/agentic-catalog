import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { promptsApi } from '../api/services';
import { 
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptVariable
} from '../types';
import { useAppStore, useFilteredPrompts } from '../store/useAppStore';
import {
  PromptsHeader,
  PromptsFilters,
  PromptsGrid,
  PromptFormModal,
  PromptViewModal,
} from '../components/prompts';
import toast from 'react-hot-toast';

const Prompts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prompts = useFilteredPrompts();
  const {
    promptsLoading,
    setPrompts,
    setPromptsLoading,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
  } = useAppStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [variables, setVariables] = useState<PromptVariable[]>([]);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [executedTemplate, setExecutedTemplate] = useState<string>('');
  const [isExecuted, setIsExecuted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePromptRequest>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<UpdatePromptRequest>();

  useEffect(() => {
    fetchPrompts();
  }, [searchParams]);

  const fetchPrompts = async () => {
    try {
      setPromptsLoading(true);
      const params = {
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        page: 1,
        limit: 20,
      };
      const response = await promptsApi.getAll(params);
      setPrompts(response.data);
    } catch (error) {
      toast.error('Failed to fetch prompts');
    } finally {
      setPromptsLoading(false);
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

  const onCreateSubmit = async (data: any) => {
    try {
      const tagsArray = data.tags && typeof data.tags === 'string' 
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : Array.isArray(data.tags) ? data.tags : [];
        
      const promptData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        isPublic: data.isPublic || false,
        variables,
        tags: tagsArray,
        relatedPrompts: [],
      };
      await promptsApi.create(promptData);
      toast.success('Prompt created successfully');
      setIsCreateModalOpen(false);
      reset();
      setVariables([]);
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to create prompt');
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!editingPrompt) return;
    
    try {
      const tagsArray = data.tags && typeof data.tags === 'string' 
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : Array.isArray(data.tags) ? data.tags : editingPrompt.tags;
        
      const promptData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        isPublic: data.isPublic,
        variables,
        tags: tagsArray,
        relatedPrompts: editingPrompt.relatedPrompts,
      };
      await promptsApi.update(editingPrompt.id, promptData);
      toast.success('Prompt updated successfully');
      setIsEditModalOpen(false);
      setEditingPrompt(null);
      resetEdit();
      setVariables([]);
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to update prompt');
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setValueEdit('title', prompt.title);
    setValueEdit('description', prompt.description);
    setValueEdit('content', prompt.content);
    setValueEdit('category', prompt.category);
    setValueEdit('tags', prompt.tags.join(', ') as any);
    setValueEdit('isPublic', prompt.isPublic);
    setVariables(prompt.variables || []);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      await promptsApi.delete(id);
      toast.success('Prompt deleted successfully');
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to delete prompt');
    }
  };

  const handleView = (prompt: Prompt) => {
    setViewingPrompt(prompt);
    setIsViewModalOpen(true);
    setIsExecuted(false);
    setExecutedTemplate('');
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingPrompt(null);
    setIsExecuted(false);
    setExecutedTemplate('');
  };

  const handleExecutePrompt = (variableValues: Record<string, string>) => {
    if (!viewingPrompt) return;
    
    let processedTemplate = viewingPrompt.content;
    
    // Replace variables in the template
    viewingPrompt.variables?.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || '';
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });
    
    setExecutedTemplate(processedTemplate);
    setIsExecuted(true);
  };

  if (promptsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PromptsHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      
      <PromptsFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryFilter}
      />

      <PromptsGrid
        prompts={prompts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      <PromptFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setVariables([]);
        }}
        title="Create New Prompt"
        onSubmit={handleSubmit(onCreateSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        variables={variables}
        onAddVariable={addVariable}
        onRemoveVariable={removeVariable}
        onUpdateVariable={updateVariable}
        submitButtonText="Create Prompt"
      />

      {/* Edit Modal */}
      <PromptFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setVariables([]);
        }}
        title="Edit Prompt"
        onSubmit={handleSubmitEdit(onEditSubmit)}
        register={registerEdit}
        errors={errorsEdit}
        isSubmitting={isSubmittingEdit}
        variables={variables}
        onAddVariable={addVariable}
        onRemoveVariable={removeVariable}
        onUpdateVariable={updateVariable}
        submitButtonText="Update Prompt"
      />

      {/* View/Execute Modal */}
      <PromptViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        prompt={viewingPrompt}
        isExecuted={isExecuted}
        executedTemplate={executedTemplate}
        onExecute={handleExecutePrompt}
        onReset={() => setIsExecuted(false)}
      />
    </div>
  );
};

export default Prompts;