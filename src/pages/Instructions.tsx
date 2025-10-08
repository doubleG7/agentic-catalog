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
  FileText,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { instructionsApi } from '../api/services';
import { 
  Instruction,
  InstructionCategory, 
  CreateInstructionRequest,
  UpdateInstructionRequest,
  InstructionVariable
} from '../types';
import { useAppStore, useFilteredInstructions } from '../store/useAppStore';
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

  const categoryOptions = Object.values(InstructionCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  if (instructionsLoading) {
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
            Instructions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your instruction sets and templates for various business contexts.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Instruction
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
                placeholder="Search instructions..."
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

      {/* Instructions Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {instructions.map((instruction) => (
          <div key={instruction.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {instruction.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                  {instruction.description}
                </p>
              </div>
              {instruction.isPublic && (
                <Star className="h-5 w-5 text-yellow-400 ml-2" />
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {instruction.category.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(instruction.updatedAt).toLocaleDateString()}
                  </div>
                  {instruction.variables && instruction.variables.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Settings className="h-3 w-3 mr-1" />
                      {instruction.variables.length} variables
                    </div>
                  )}
                </div>
                {instruction.metadata?.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    instruction.metadata.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    instruction.metadata.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {instruction.metadata.difficulty}
                  </span>
                )}
              </div>

              {instruction.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {instruction.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {instruction.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{instruction.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(instruction)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(instruction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {instructions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No instructions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first instruction.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Instruction
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
          reset();
        }}
        title="Create New Instruction"
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
          />
          
          {/* Variables Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Variables</h3>
              <Button type="button" variant="outline" size="sm" onClick={addVariable}>
                Add Variable
              </Button>
            </div>
            
            {variables.length === 0 ? (
              <p className="text-sm text-gray-500">No variables defined. Variables allow users to customize the instruction content.</p>
            ) : (
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Variable name"
                        value={variable.name}
                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <select
                        value={variable.type}
                        onChange={(e) => updateVariable(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                        value={variable.description}
                        onChange={(e) => updateVariable(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={variable.required}
                            onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                            className="mr-2"
                          />
                          Required
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariable(index)}
                          className="text-red-600 hover:text-red-700"
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

          {/* Metadata Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Author"
                {...register('author')}
                placeholder="Enter author name"
              />
              <Input
                label="Version"
                {...register('version')}
                placeholder="1.0"
              />
              <Select
                label="Difficulty"
                options={[
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Advanced', value: 'advanced' }
                ]}
                {...register('difficulty')}
              />
              <Input
                label="Estimated Time (minutes)"
                type="number"
                {...register('estimatedTime')}
                placeholder="30"
              />
            </div>
            <div className="mt-4 space-y-4">
              <Input
                label="Prerequisites (comma-separated)"
                {...register('prerequisites')}
                placeholder="Basic knowledge of..."
              />
              <Input
                label="Expected Outputs (comma-separated)"
                {...register('outputs')}
                placeholder="Report, analysis, summary..."
              />
            </div>
          </div>

          <div className="flex items-center border-t pt-4">
            <input
              type="checkbox"
              id="isPublic"
              {...register('isPublic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              Make this instruction public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setVariables([]);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Instruction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditVariables([]);
          setEditingInstruction(null);
          resetEdit();
        }}
        title="Edit Instruction"
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
          />

          {/* Variables Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Variables</h3>
              <Button type="button" variant="outline" size="sm" onClick={addEditVariable}>
                Add Variable
              </Button>
            </div>
            
            {editVariables.length === 0 ? (
              <p className="text-sm text-gray-500">No variables defined. Variables allow users to customize the instruction content.</p>
            ) : (
              <div className="space-y-3">
                {editVariables.map((variable, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Variable name"
                        value={variable.name}
                        onChange={(e) => updateEditVariable(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <select
                        value={variable.type}
                        onChange={(e) => updateEditVariable(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                        value={variable.description}
                        onChange={(e) => updateEditVariable(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={variable.required}
                            onChange={(e) => updateEditVariable(index, 'required', e.target.checked)}
                            className="mr-2"
                          />
                          Required
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEditVariable(index)}
                          className="text-red-600 hover:text-red-700"
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

          {/* Metadata Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Author"
                {...registerEdit('author')}
                placeholder="Enter author name"
              />
              <Input
                label="Version"
                {...registerEdit('version')}
                placeholder="1.0"
              />
              <Select
                label="Difficulty"
                options={[
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Advanced', value: 'advanced' }
                ]}
                {...registerEdit('difficulty')}
              />
              <Input
                label="Estimated Time (minutes)"
                type="number"
                {...registerEdit('estimatedTime')}
                placeholder="30"
              />
            </div>
            <div className="mt-4 space-y-4">
              <Input
                label="Prerequisites (comma-separated)"
                {...registerEdit('prerequisites')}
                placeholder="Basic knowledge of..."
              />
              <Input
                label="Expected Outputs (comma-separated)"
                {...registerEdit('outputs')}
                placeholder="Report, analysis, summary..."
              />
            </div>
          </div>
          
          <div className="flex items-center border-t pt-4">
            <input
              type="checkbox"
              id="isPublicEdit"
              {...registerEdit('isPublic')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublicEdit" className="ml-2 block text-sm text-gray-900">
              Make this instruction public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditVariables([]);
                setEditingInstruction(null);
                resetEdit();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmittingEdit}>
              Update Instruction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Instructions;