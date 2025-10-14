import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  GitBranch, 
  Plus, 
  Users
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ErrorBoundary, ApiErrorBoundary } from '../components/ErrorBoundary';
import { PageLoading } from '../components/LoadingState';
import { instructionsApi, promptsApi, healthApi } from '../api/services';
import { useAppStore } from '../store/useAppStore';
import { 
  Instruction, 
  Prompt, 
  PromptVariable
} from '../types';
import { 
  DashboardStats, 
  InstructionsPanel, 
  PromptsPanel, 
  EditModals 
} from '../components/dashboard';
import { PromptViewModal } from '../components/prompts/PromptViewModal';
import { InstructionViewModal } from '../components/instructions/InstructionViewModal';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const {
    setInstructions,
    setPrompts,
    setHealthStatus,
    instructionsLoading,
  } = useAppStore();
  
  // State for dashboard data
  const [allInstructions, setAllInstructions] = useState<Instruction[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [instructionsPage, setInstructionsPage] = useState(1);
  const [promptsPage, setPromptsPage] = useState(1);
  const [instructionsHasMore, setInstructionsHasMore] = useState(true);
  const [promptsHasMore, setPromptsHasMore] = useState(true);
  const [instructionsScrollLoading, setInstructionsScrollLoading] = useState(false);
  const [promptsScrollLoading, setPromptsScrollLoading] = useState(false);
  // Rating functionality will be handled through the individual components
  
  // Edit modal states
  const [isEditInstructionModalOpen, setIsEditInstructionModalOpen] = useState(false);
  const [isEditPromptModalOpen, setIsEditPromptModalOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [variables, setVariables] = useState<PromptVariable[]>([]);

  // View modal states
  const [viewingInstruction, setViewingInstruction] = useState<Instruction | null>(null);
  const [isViewInstructionModalOpen, setIsViewInstructionModalOpen] = useState(false);
  const [instructionExecutedTemplate, setInstructionExecutedTemplate] = useState<string>('');
  const [isInstructionExecuted, setIsInstructionExecuted] = useState(false);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [isViewPromptModalOpen, setIsViewPromptModalOpen] = useState(false);
  const [promptExecutedTemplate, setPromptExecutedTemplate] = useState<string>('');
  const [isPromptExecuted, setIsPromptExecuted] = useState(false);

  // Load more functions for infinite scrolling
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

  // Edit handlers
  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setIsEditInstructionModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
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

  const handleInstructionRating = (id: string, rating: number) => {
    // Update the instruction's rating in the local state
    setAllInstructions(prev => 
      prev.map(instruction => 
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
      )
    );
    toast.success('Rating submitted successfully');
  };

  const handlePromptRating = (id: string, rating: number) => {
    // Update the prompt's rating in the local state
    setAllPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id 
          ? {
              ...prompt,
              rating: {
                average: rating, // In a real app, this would be calculated server-side
                count: (prompt.rating?.count || 0) + 1,
                userRating: rating
              }
            }
          : prompt
      )
    );
    toast.success('Rating submitted successfully');
  };

  // View handlers
  const handleViewInstruction = (instruction: Instruction) => {
    setViewingInstruction(instruction);
    setIsInstructionExecuted(false);
    setInstructionExecutedTemplate('');
    requestAnimationFrame(() => {
      setIsViewInstructionModalOpen(true);
    });
  };

  const handleCloseInstructionViewModal = () => {
    setIsViewInstructionModalOpen(false);
    setTimeout(() => {
      setViewingInstruction(null);
      setIsInstructionExecuted(false);
      setInstructionExecutedTemplate('');
    }, 200);
  };

  const handleExecuteInstruction = (variableValues: Record<string, string>) => {
    if (!viewingInstruction) return;
    
    let processedTemplate = viewingInstruction.content;
    
    viewingInstruction.variables?.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || '';
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });
    
    setInstructionExecutedTemplate(processedTemplate);
    setIsInstructionExecuted(true);
  };

  const handleViewPrompt = (prompt: Prompt) => {
    setViewingPrompt(prompt);
    setIsPromptExecuted(false);
    setPromptExecutedTemplate('');
    requestAnimationFrame(() => {
      setIsViewPromptModalOpen(true);
    });
  };

  const handleClosePromptViewModal = () => {
    setIsViewPromptModalOpen(false);
    setTimeout(() => {
      setViewingPrompt(null);
      setIsPromptExecuted(false);
      setPromptExecutedTemplate('');
    }, 200);
  };

  const handleExecutePrompt = (variableValues: Record<string, string>) => {
    if (!viewingPrompt) return;
    
    let processedTemplate = viewingPrompt.content;
    
    viewingPrompt.variables?.forEach(variable => {
      const value = variableValues[variable.name] || variable.defaultValue || '';
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });
    
    setPromptExecutedTemplate(processedTemplate);
    setIsPromptExecuted(true);
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

  const stats = [
    {
      name: 'Total Instructions',
      value: allInstructions.length.toString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: FileText,
    },
    {
      name: 'Total Prompts',
      value: allPrompts.length.toString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: MessageSquare,
    },
    {
      name: 'Active Projects',
      value: '23',
      change: '+2%',
      changeType: 'increase' as const,
      icon: GitBranch,
    },
    {
      name: 'Team Members',
      value: '12',
      change: '0%',
      changeType: 'neutral' as const,
      icon: Users,
    },
  ];

  if (instructionsLoading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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

        {/* Stats Component */}
        <ErrorBoundary>
          <DashboardStats stats={stats} />
        </ErrorBoundary>

        {/* Recent Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Instructions Panel */}
          <ApiErrorBoundary>
            <InstructionsPanel
              instructions={allInstructions}
              loading={instructionsScrollLoading}
              hasMore={instructionsHasMore}
              onLoadMore={loadMoreInstructions}
              onView={handleViewInstruction}
              onEdit={handleEditInstruction}
              onDelete={handleDeleteInstruction}
              onRatingChange={handleInstructionRating}
            />
          </ApiErrorBoundary>

          {/* Prompts Panel */}
          <ApiErrorBoundary>
            <PromptsPanel
              prompts={allPrompts}
              loading={promptsScrollLoading}
              hasMore={promptsHasMore}
              onLoadMore={loadMorePrompts}
              onView={handleViewPrompt}
              onEdit={handleEditPrompt}
              onDelete={handleDeletePrompt}
              onRatingChange={handlePromptRating}
            />
          </ApiErrorBoundary>
        </div>

        {/* System Health Panel */}
        {/*<ErrorBoundary>
           <SystemHealthPanel healthStatus={healthStatus} /> 
        </ErrorBoundary>*/}

        {/* Edit Modals */}
        <ErrorBoundary>
          <EditModals
            isEditInstructionModalOpen={isEditInstructionModalOpen}
            editingInstruction={editingInstruction}
            onCloseInstructionModal={() => {
              setIsEditInstructionModalOpen(false);
              setEditingInstruction(null);
            }}
            onSubmitInstructionEdit={onInstructionEditSubmit}
            isEditPromptModalOpen={isEditPromptModalOpen}
            editingPrompt={editingPrompt}
            onClosePromptModal={() => {
              setIsEditPromptModalOpen(false);
              setEditingPrompt(null);
              setVariables([]);
            }}
            onSubmitPromptEdit={onPromptEditSubmit}
            variables={variables}
            setVariables={setVariables}
          />
        </ErrorBoundary>

        {/* View Modals */}
        <ErrorBoundary>
          <InstructionViewModal
            isOpen={isViewInstructionModalOpen}
            onClose={handleCloseInstructionViewModal}
            instruction={viewingInstruction}
            isExecuted={isInstructionExecuted}
            executedTemplate={instructionExecutedTemplate}
            onExecute={handleExecuteInstruction}
            onReset={() => setIsInstructionExecuted(false)}
          />
          <PromptViewModal
            isOpen={isViewPromptModalOpen}
            onClose={handleClosePromptViewModal}
            prompt={viewingPrompt}
            isExecuted={isPromptExecuted}
            executedTemplate={promptExecutedTemplate}
            onExecute={handleExecutePrompt}
            onReset={() => setIsPromptExecuted(false)}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;