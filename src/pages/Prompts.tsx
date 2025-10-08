import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Clock,
  Tag,
  MessageSquare,
  Settings,
  Copy
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PromptExecutionForm } from '../components/PromptExecutionForm';
import { promptsApi } from '../api/services';
import { 
  Prompt,
  PromptCategory, 
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptVariable
} from '../types';
import { useAppStore, useFilteredPrompts } from '../store/useAppStore';
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

  const categoryOptions = Object.values(PromptCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  if (promptsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Prompts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your prompt templates and AI instructions for various use cases.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search prompts..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {prompt.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                  {prompt.description}
                </p>
              </div>
              {prompt.isPublic && (
                <Star className="h-5 w-5 text-yellow-400 ml-2" />
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {prompt.category.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(prompt.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {prompt.variables && prompt.variables.length > 0 && (
                <div className="mt-2 flex items-center">
                  <Settings className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">
                    {prompt.variables.length} variable{prompt.variables.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {prompt.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{prompt.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleView(prompt)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(prompt)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(prompt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No prompts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first prompt template.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Prompt
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setVariables([]);
        }}
        title="Create New Prompt"
        size="lg"
      >
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <Input
            label="Title *"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          
          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />
          
          <Textarea
            label="Content *"
            rows={8}
            placeholder="Enter your prompt template. Use {variableName} for dynamic variables."
            {...register('content', { required: 'Content is required' })}
            error={errors.content?.message}
          />
          
          <Select
            label="Category *"
            options={categoryOptions}
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
          />
          
          <Input
            label="Tags (comma-separated)"
            {...register('tags')}
            error={errors.tags?.message}
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
              id="isPublic"
              {...register('isPublic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              Make this prompt public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setVariables([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Prompt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setVariables([]);
        }}
        title="Edit Prompt"
        size="lg"
      >
        <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
          <Input
            label="Title *"
            {...registerEdit('title', { required: 'Title is required' })}
            error={errorsEdit.title?.message}
          />
          
          <Textarea
            label="Description"
            {...registerEdit('description')}
            error={errorsEdit.description?.message}
          />
          
          <Textarea
            label="Content *"
            rows={8}
            placeholder="Enter your prompt template. Use {variableName} for dynamic variables."
            {...registerEdit('content', { required: 'Content is required' })}
            error={errorsEdit.content?.message}
          />
          
          <Select
            label="Category *"
            options={categoryOptions}
            {...registerEdit('category', { required: 'Category is required' })}
            error={errorsEdit.category?.message}
          />
          
          <Input
            label="Tags (comma-separated)"
            {...registerEdit('tags')}
            error={errorsEdit.tags?.message}
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
              id="isPublicEdit"
              {...registerEdit('isPublic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublicEdit" className="ml-2 block text-sm text-gray-900">
              Make this prompt public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setVariables([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmittingEdit}>
              Update Prompt
            </Button>
          </div>
        </form>
      </Modal>

      {/* View/Execute Modal */}
      {isViewModalOpen && viewingPrompt && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          title={isExecuted ? 'Executed Prompt' : 'Execute Prompt'}
          size="xl"
        >
          {!isExecuted ? (
            <PromptExecutionForm
              prompt={viewingPrompt}
              onExecute={handleExecutePrompt}
              onCancel={handleCloseViewModal}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generated Output for: {viewingPrompt.title}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(executedTemplate)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsExecuted(false)}
                  >
                    Edit Variables
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {executedTemplate}
                </pre>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Prompts;