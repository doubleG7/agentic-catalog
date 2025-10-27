import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { promptsApi, ratingsApi } from '../api/services';
import { 
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptVariable
} from '../types';
import { useAppStore } from '../store/useAppStore';
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
  const {
    prompts,
    promptsLoading,
    setPrompts,
    setPromptsLoading,
    addPrompt,
    updatePrompt,
  } = useAppStore();
  
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  
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
  }, []);

  // Sync category state when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const fetchPrompts = async () => {
    try {
      setPromptsLoading(true);
      const response = await promptsApi.getAll({ page: 1, limit: 100 });
      setPrompts(response.data);
    } catch (error) {
      toast.error('Failed to fetch prompts');
    } finally {
      setPromptsLoading(false);
    }
  };

  // Filter prompts based on search and category, sorted by highest ratings
  useEffect(() => {
    let filtered = prompts;

    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt =>
        prompt.category === selectedCategory
      );
    }

    // Sort by highest average rating
    filtered.sort((a, b) => {
      const aRating = a.rating?.average || 0;
      const bRating = b.rating?.average || 0;
      return bRating - aRating;
    });

    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, selectedCategory]);

  const addVariable = () => {
    setVariables([
      ...variables,
      {
        name: '',
        type: 'TEXT',
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
      const response = await promptsApi.create(promptData);
      
      // Update store immediately with new prompt
      if (response.data) {
        addPrompt(response.data);
      }
      
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
      const response = await promptsApi.update(editingPrompt.id, promptData);
      
      // Update store immediately with updated prompt
      if (response.data) {
        updatePrompt(editingPrompt.id, response.data);
      }
      
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

  const handleRating = async (id: string, rating: number) => {
    try {
      console.log('=== RATING DEBUG ===');
      console.log('Submitting rating for prompt:', { id, rating });
      
      // Optimistic update - show stars filled immediately
      const optimisticPrompts = prompts.map(prompt => 
        prompt.id === id 
          ? {
              ...prompt,
              rating: {
                average: prompt.rating?.average || rating,
                count: prompt.rating?.count || 1,
                userRating: rating
              }
            }
          : prompt
      );
      setPrompts(optimisticPrompts);
      
      // Call the backend API to save the rating
      const response = await ratingsApi.ratePrompt(id, rating);
      
      console.log('Rating response:', response);
      
      // The response object has stats at the top level
      const stats = response.stats || (response as any).data?.stats;
      
      if (response.success && stats) {
        console.log('Stats found:', stats);
        // Update with server stats
        const updatedPrompts = prompts.map(prompt => 
          prompt.id === id 
            ? {
                ...prompt,
                rating: {
                  average: stats.average,
                  count: stats.count,
                  userRating: stats.userRating || rating
                }
              }
            : prompt
        );
        setPrompts(updatedPrompts);
        toast.success('Rating submitted successfully');
      } else {
        console.warn('Response missing success or stats:', response);
        toast.error('Rating response incomplete');
      }
    } catch (error) {
      console.error('=== RATING ERROR ===');
      console.error('Failed to submit rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const handleView = (prompt: Prompt) => {
    // Batch state updates to prevent flashing
    setViewingPrompt(prompt);
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
      setViewingPrompt(null);
      setIsExecuted(false);
      setExecutedTemplate('');
    }, 200); // Match modal exit animation duration
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PromptsHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      
      <PromptsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <PromptsGrid
        prompts={filteredPrompts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRatingChange={handleRating}
        onCreateClick={() => setIsCreateModalOpen(true)}
        gridRef={gridRef}
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
        containerRef={gridRef}
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
        containerRef={gridRef}
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
        containerRef={gridRef}
      />
    </motion.div>
  );
};

export default Prompts;