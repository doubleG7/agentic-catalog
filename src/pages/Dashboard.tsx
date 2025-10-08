import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  FileText, 
  MessageSquare, 
  GitBranch, 
  Plus, 
  TrendingUp,
  Clock,
  Users,
  Star,
  Loader2,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { instructionsApi, promptsApi, healthApi } from '../api/services';
import { useAppStore } from '../store/useAppStore';
import { 
  Instruction, 
  Prompt, 
  InstructionCategory,
  PromptCategory,
  UpdateInstructionRequest,
  UpdatePromptRequest,
  PromptVariable
} from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const {
    setInstructions,
    setPrompts,
    setHealthStatus,
    instructionsLoading,
    healthStatus,
  } = useAppStore();
  
  // We're using allInstructions and allPrompts for infinite scrolling instead
  
  // Infinite scrolling state
  const [allInstructions, setAllInstructions] = useState<Instruction[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [instructionsPage, setInstructionsPage] = useState(1);
  const [promptsPage, setPromptsPage] = useState(1);
  const [instructionsHasMore, setInstructionsHasMore] = useState(true);
  const [promptsHasMore, setPromptsHasMore] = useState(true);
  const [instructionsScrollLoading, setInstructionsScrollLoading] = useState(false);
  const [promptsScrollLoading, setPromptsScrollLoading] = useState(false);
  
  // Refs for scroll containers
  const instructionsScrollRef = useRef<HTMLDivElement>(null);
  const promptsScrollRef = useRef<HTMLDivElement>(null);
  
  // Edit modal states
  const [isEditInstructionModalOpen, setIsEditInstructionModalOpen] = useState(false);
  const [isEditPromptModalOpen, setIsEditPromptModalOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [variables, setVariables] = useState<PromptVariable[]>([]);
  const [favoriteInstructions, setFavoriteInstructions] = useState<Set<string>>(new Set());
  const [favoritePrompts, setFavoritePrompts] = useState<Set<string>>(new Set());

  // Form hooks
  const {
    register: registerInstructionEdit,
    handleSubmit: handleSubmitInstructionEdit,
    reset: resetInstructionEdit,
    setValue: setValueInstructionEdit,
    formState: { errors: errorsInstructionEdit, isSubmitting: isSubmittingInstructionEdit },
  } = useForm<UpdateInstructionRequest>();

  const {
    register: registerPromptEdit,
    handleSubmit: handleSubmitPromptEdit,
    reset: resetPromptEdit,
    setValue: setValuePromptEdit,
    formState: { errors: errorsPromptEdit, isSubmitting: isSubmittingPromptEdit },
  } = useForm<UpdatePromptRequest>();

  const loadMoreInstructions = useCallback(async () => {
    if (instructionsScrollLoading || !instructionsHasMore) return;
    
    setInstructionsScrollLoading(true);
    try {
      const response = await instructionsApi.getAll({ 
        page: instructionsPage, 
        limit: 10 
      });
      
      if (response.data.length === 0) {
        setInstructionsHasMore(false);
      } else {
        setAllInstructions(prev => [...prev, ...response.data]);
        setInstructionsPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load more instructions:', error);
    } finally {
      setInstructionsScrollLoading(false);
    }
  }, [instructionsPage, instructionsScrollLoading, instructionsHasMore]);
  
  const loadMorePrompts = useCallback(async () => {
    if (promptsScrollLoading || !promptsHasMore) return;
    
    setPromptsScrollLoading(true);
    try {
      const response = await promptsApi.getAll({ 
        page: promptsPage, 
        limit: 10 
      });
      
      if (response.data.length === 0) {
        setPromptsHasMore(false);
      } else {
        setAllPrompts(prev => [...prev, ...response.data]);
        setPromptsPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load more prompts:', error);
    } finally {
      setPromptsScrollLoading(false);
    }
  }, [promptsPage, promptsScrollLoading, promptsHasMore]);
  
  const handleInstructionsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMoreInstructions();
    }
  }, [loadMoreInstructions]);
  
  const handlePromptsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMorePrompts();
    }
  }, [loadMorePrompts]);

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

  // Edit handlers
  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setValueInstructionEdit('title', instruction.title);
    setValueInstructionEdit('description', instruction.description);
    setValueInstructionEdit('content', instruction.content);
    setValueInstructionEdit('category', instruction.category);
    setValueInstructionEdit('tags', instruction.tags);
    setValueInstructionEdit('isPublic', instruction.isPublic);
    setIsEditInstructionModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setValuePromptEdit('title', prompt.title);
    setValuePromptEdit('description', prompt.description);
    setValuePromptEdit('content', prompt.content);
    setValuePromptEdit('category', prompt.category);
    setValuePromptEdit('tags', prompt.tags.join(', ') as any);
    setValuePromptEdit('isPublic', prompt.isPublic);
    setVariables(prompt.variables || []);
    setIsEditPromptModalOpen(true);
  };

  const onInstructionEditSubmit = async (data: any) => {
    if (!editingInstruction) return;
    
    try {
      const instructionData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        isPublic: data.isPublic,
        tags: Array.isArray(data.tags) ? data.tags : [],
        relatedInstructions: editingInstruction.relatedInstructions,
      };
      await instructionsApi.update(editingInstruction.id, instructionData);
      toast.success('Instruction updated successfully');
      setIsEditInstructionModalOpen(false);
      setEditingInstruction(null);
      resetInstructionEdit();
      // Refresh the instructions list
      const updatedInstructions = allInstructions.map(inst => 
        inst.id === editingInstruction.id ? { ...inst, ...instructionData } : inst
      );
      setAllInstructions(updatedInstructions);
    } catch (error) {
      toast.error('Failed to update instruction');
    }
  };

  const onPromptEditSubmit = async (data: any) => {
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
      setIsEditPromptModalOpen(false);
      setEditingPrompt(null);
      resetPromptEdit();
      setVariables([]);
      // Refresh the prompts list
      const updatedPrompts = allPrompts.map(prompt => 
        prompt.id === editingPrompt.id ? { ...prompt, ...promptData } : prompt
      );
      setAllPrompts(updatedPrompts);
    } catch (error) {
      toast.error('Failed to update prompt');
    }
  };

  const handleDeleteInstruction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instruction?')) return;
    
    try {
      await instructionsApi.delete(id);
      toast.success('Instruction deleted successfully');
      setAllInstructions(allInstructions.filter(inst => inst.id !== id));
    } catch (error) {
      toast.error('Failed to delete instruction');
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      await promptsApi.delete(id);
      toast.success('Prompt deleted successfully');
      setAllPrompts(allPrompts.filter(prompt => prompt.id !== id));
    } catch (error) {
      toast.error('Failed to delete prompt');
    }
  };

  const toggleInstructionFavorite = (id: string) => {
    const newFavorites = new Set(favoriteInstructions);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(id);
      toast.success('Added to favorites');
    }
    setFavoriteInstructions(newFavorites);
  };

  const togglePromptFavorite = (id: string) => {
    const newFavorites = new Set(favoritePrompts);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(id);
      toast.success('Added to favorites');
    }
    setFavoritePrompts(newFavorites);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [instructionsResponse, promptsResponse, health] = await Promise.all([
          instructionsApi.getAll({ limit: 5 }),
          promptsApi.getAll({ limit: 5 }),
          healthApi.getStatus(),
        ]);

        setInstructions(instructionsResponse.data);
        setPrompts(promptsResponse.data);
        setHealthStatus(health);
        
        // Initialize infinite scroll data
        setAllInstructions(instructionsResponse.data);
        setAllPrompts(promptsResponse.data);
        setInstructionsPage(2);
        setPromptsPage(2);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [setInstructions, setPrompts, setHealthStatus]);

  const instructionCategoryOptions = Object.values(InstructionCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  const promptCategoryOptions = Object.values(PromptCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

  const stats = [
    {
      name: 'Total Instructions',
      value: '127',
      change: '+12%',
      changeType: 'increase',
      icon: FileText,
    },
    {
      name: 'Total Prompts',
      value: '84',
      change: '+8%',
      changeType: 'increase',
      icon: MessageSquare,
    },
    {
      name: 'Active Projects',
      value: '23',
      change: '+2%',
      changeType: 'increase',
      icon: GitBranch,
    },
    {
      name: 'Team Members',
      value: '12',
      change: '0%',
      changeType: 'neutral',
      icon: Users,
    },
  ];

  if (instructionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your prompts and instructions.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link to="/instructions">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Instruction
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : stat.changeType === 'decrease'
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {stat.changeType === 'increase' && (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Instructions */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Instructions
              </h3>
              <Link
                to="/instructions"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div 
            ref={instructionsScrollRef}
            className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
            onScroll={handleInstructionsScroll}
          >
            <div className="divide-y divide-gray-200">
              {allInstructions.map((instruction) => (
                <div key={instruction.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/instructions/${instruction.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {instruction.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {instruction.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {instruction.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(instruction.updatedAt).toLocaleDateString()}
                        </div>
                        {instruction.isPublic && (
                          <div className="flex items-center text-xs text-green-600">
                            <Star className="h-3 w-3 mr-1" />
                            Public
                          </div>
                        )}
                      </div>
                      <div className="flex items-center mt-3 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditInstruction(instruction);
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteInstruction(instruction.id);
                          }}
                          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleInstructionFavorite(instruction.id);
                      }}
                      className="h-10 w-10 p-0 text-gray-400 hover:text-yellow-500"
                    >
                      <Star className={`h-6 w-6 ${favoriteInstructions.has(instruction.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </div>
                </div>
              ))}
              {instructionsScrollLoading && (
                <div className="px-6 py-4 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-600 mr-2" />
                  <span className="text-sm text-gray-500">Loading more instructions...</span>
                </div>
              )}
              {!instructionsHasMore && allInstructions.length > 0 && (
                <div className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-500">No more instructions to load</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Prompts */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Prompts
              </h3>
              <Link
                to="/prompts"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div 
            ref={promptsScrollRef}
            className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
            onScroll={handlePromptsScroll}
          >
            <div className="divide-y divide-gray-200">
              {allPrompts.map((prompt) => (
                <div key={prompt.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/prompts/${prompt.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {prompt.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {prompt.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {prompt.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(prompt.updatedAt).toLocaleDateString()}
                        </div>
                        {prompt.variables && prompt.variables.length > 0 && (
                          <div className="flex items-center">
                            <Settings className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs text-blue-600">
                              {prompt.variables.length} var{prompt.variables.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        {prompt.isPublic && (
                          <div className="flex items-center text-xs text-green-600">
                            <Star className="h-3 w-3 mr-1" />
                            Public
                          </div>
                        )}
                      </div>
                      <div className="flex items-center mt-3 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditPrompt(prompt);
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeletePrompt(prompt.id);
                          }}
                          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePromptFavorite(prompt.id);
                      }}
                      className="h-10 w-10 p-0 text-gray-400 hover:text-yellow-500"
                    >
                      <Star className={`h-6 w-6 ${favoritePrompts.has(prompt.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </div>
                </div>
              ))}
              {promptsScrollLoading && (
                <div className="px-6 py-4 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-600 mr-2" />
                  <span className="text-sm text-gray-500">Loading more prompts...</span>
                </div>
              )}
              {!promptsHasMore && allPrompts.length > 0 && (
                <div className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-500">No more prompts to load</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      {healthStatus && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
              <p className="text-sm text-gray-500">Current system health</p>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                healthStatus.status === 'healthy'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {healthStatus.status === 'healthy' ? 'All systems operational' : 'Issues detected'}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  healthStatus.services.database === 'up' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">Database</span>
            </div>
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  healthStatus.services.api === 'up' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">API</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Instruction Modal */}
      <Modal
        isOpen={isEditInstructionModalOpen}
        onClose={() => {
          setIsEditInstructionModalOpen(false);
          setEditingInstruction(null);
          resetInstructionEdit();
        }}
        title="Edit Instruction"
        size="lg"
      >
        <form onSubmit={handleSubmitInstructionEdit(onInstructionEditSubmit)} className="space-y-4">
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
              onClick={() => {
                setIsEditInstructionModalOpen(false);
                setEditingInstruction(null);
                resetInstructionEdit();
              }}
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
        onClose={() => {
          setIsEditPromptModalOpen(false);
          setEditingPrompt(null);
          resetPromptEdit();
          setVariables([]);
        }}
        title="Edit Prompt"
        size="lg"
      >
        <form onSubmit={handleSubmitPromptEdit(onPromptEditSubmit)} className="space-y-4">
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
              onClick={() => {
                setIsEditPromptModalOpen(false);
                setEditingPrompt(null);
                resetPromptEdit();
                setVariables([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmittingPromptEdit}>
              Update Prompt
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;