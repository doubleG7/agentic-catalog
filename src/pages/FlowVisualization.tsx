import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
  Handle,
  Position,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { instructionsApi, promptsApi } from '../api/services';
import { Instruction, Prompt, InstructionCategory, PromptCategory, UpdateInstructionRequest, UpdatePromptRequest, PromptVariable } from '../types';
import toast from 'react-hot-toast';
import { Maximize2, Menu, X, Trash2, FolderOpen, Edit, Plus } from 'lucide-react';

// Custom node components
const InstructionNode = ({ data, selected, id }: { data: any; selected?: boolean; id: string }) => {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger edit modal - we'll access this through a custom event
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, type: 'instruction', data } }));
  };

  return (
    <div className={`relative px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-2 min-w-[220px] transition-all duration-200 group ${
      selected ? 'border-blue-500 shadow-blue-200' : 'border-blue-200 hover:border-blue-300'
    }`}>
      {/* Action Buttons */}
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={handleEdit}
          className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"
          title="Edit node"
        >
          <Edit size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
          title="Delete node"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      {/* Input handles 
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      />*/}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-md"
        style={{ top: -6 }}
      />
      
      {/* Node content */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">📋</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-blue-900 leading-tight">{data.label}</div>
          <div className="text-gray-600 text-xs mt-1 line-clamp-2">{data.description}</div>
          <div className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-blue-500 text-white rounded-full">
            {data.category}
          </div>
        </div>
      </div>
      
      {/* Output handles
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-600 border-2 border-white shadow-md"
        style={{ right: -6 }}
      /> */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-600 border-2 border-white shadow-md"
        style={{ bottom: -6 }}
      />
    </div>
  );
};

const PromptNode = ({ data, selected, id }: { data: any; selected?: boolean; id: string }) => {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger edit modal - we'll access this through a custom event
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, type: 'prompt', data } }));
  };

  return (
    <div className={`relative px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 border-2 min-w-[220px] transition-all duration-200 group ${
      selected ? 'border-green-500 shadow-green-200' : 'border-green-200 hover:border-green-300'
    }`}>
      {/* Action Buttons */}
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={handleEdit}
          className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"
          title="Edit node"
        >
          <Edit size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
          title="Delete node"
        >
          <Trash2 size={12} />
        </button>
      </div>
      
      {/* Input handles
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-green-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      /> */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-green-500 border-2 border-white shadow-md"
        style={{ top: -6 }}
      />
      
      {/* Node content */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">🤖</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-green-900 leading-tight">{data.label}</div>
          <div className="text-gray-600 text-xs mt-1 line-clamp-2">{data.description}</div>
          <div className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-green-500 text-white rounded-full">
            {data.category}
          </div>
          {data.variables && data.variables.length > 0 && (
            <div className="mt-1 text-xs text-green-700">
              Variables: {data.variables.length}
            </div>
          )}
        </div>
      </div>
      
      {/* Output handles 
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-600 border-2 border-white shadow-md"
        style={{ right: -6 }}
      />*/}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-600 border-2 border-white shadow-md"
        style={{ bottom: -6 }}
      />
    </div>
  );
};

// Custom connector node for instruction sets
const ConnectorNode = ({ data, selected, id }: { data: any; selected?: boolean; id: string }) => {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className={`relative px-3 py-2 shadow-md rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 min-w-[120px] transition-all duration-200 group ${
      selected ? 'border-yellow-600 shadow-yellow-200' : 'border-yellow-300 hover:border-yellow-400'
    }`}>
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-md"
        title="Delete node"
      >
        <Trash2 size={10} />
      </button>
      
      {/* Input handles 
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-yellow-600 border border-white"
        style={{ left: -4 }}
      />*/}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-yellow-600 border border-white"
        style={{ top: -4 }}
      />
      
      {/* Node content */}
      <div className="flex items-center justify-center space-x-1">
        <span className="text-white text-xs font-bold">🔗</span>
        <span className="text-white text-xs font-medium">{data.label || 'Connector'}</span>
      </div>
      
      {/* Output handles
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-orange-600 border border-white"
        style={{ right: -4 }}
      /> */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-orange-600 border border-white"
        style={{ bottom: -4 }}
      />
    </div>
  );
};



interface Collection {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  prompts: string[];
  connections: Array<{
    from: string;
    to: string;
    type: 'instruction' | 'prompt';
  }>;
  nodePositions?: Array<{
    id: string;
    x: number;
    y: number;
    type: 'instruction' | 'prompt' | 'connector';
  }>;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

const FlowVisualization: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [instructionSets, setInstructionSets] = useState<{[key: string]: string[]}>({});
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  
  // Edit modal states
  const [isEditInstructionModalOpen, setIsEditInstructionModalOpen] = useState(false);
  const [isEditPromptModalOpen, setIsEditPromptModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Memoize node types to prevent React Flow warning
  const nodeTypes = useMemo(() => ({
    instruction: InstructionNode,
    prompt: PromptNode,
    connector: ConnectorNode,
  }), []);
  const [editVariables, setEditVariables] = useState<PromptVariable[]>([]);

  // Form hooks for editing
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

  // Variable management for prompt editing
  const addVariable = () => {
    setEditVariables([
      ...editVariables,
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
    setEditVariables(editVariables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof PromptVariable, value: any) => {
    const updated = [...editVariables];
    updated[index] = { ...updated[index], [field]: value };
    setEditVariables(updated);
  };

  // Edit handlers
  const handleEditNode = useCallback(async (event: any) => {
    const { id, type, data } = event.detail;
    setEditingNodeId(id);

    if (type === 'instruction') {
      // Fetch the full instruction data
      try {
        const instruction = instructions.find(i => i.id === data.id);
        if (instruction) {
          setEditingInstruction(instruction);
          setValueInstructionEdit('title', instruction.title);
          setValueInstructionEdit('description', instruction.description);
          setValueInstructionEdit('content', instruction.content);
          setValueInstructionEdit('category', instruction.category);
          setValueInstructionEdit('tags', instruction.tags);
          setValueInstructionEdit('isPublic', instruction.isPublic);
          setIsEditInstructionModalOpen(true);
        }
      } catch (error) {
        toast.error('Failed to load instruction data');
      }
    } else if (type === 'prompt') {
      // Fetch the full prompt data
      try {
        const prompt = prompts.find(p => p.id === data.id);
        if (prompt) {
          setEditingPrompt(prompt);
          setValuePromptEdit('title', prompt.title);
          setValuePromptEdit('description', prompt.description);
          setValuePromptEdit('content', prompt.content);
          setValuePromptEdit('category', prompt.category);
          setValuePromptEdit('tags', prompt.tags.join(', ') as any);
          setValuePromptEdit('isPublic', prompt.isPublic);
          setEditVariables(prompt.variables || []);
          setIsEditPromptModalOpen(true);
        }
      } catch (error) {
        toast.error('Failed to load prompt data');
      }
    }
  }, [instructions, prompts, setValueInstructionEdit, setValuePromptEdit]);

  // Form submission handlers
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
      
      // Update the node in the flow
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === editingNodeId || (node.data.id === editingInstruction.id && node.type === 'instruction')) {
            return {
              ...node,
              data: {
                ...node.data,
                label: data.title,
                description: data.description.substring(0, 80) + '...',
                category: data.category.replace(/_/g, ' '),
              }
            };
          }
          return node;
        })
      );
      
      toast.success('Instruction updated successfully');
      setIsEditInstructionModalOpen(false);
      setEditingInstruction(null);
      setEditingNodeId(null);
      resetInstructionEdit();
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
        variables: editVariables,
        tags: tagsArray,
        relatedPrompts: editingPrompt.relatedPrompts,
      };
      
      await promptsApi.update(editingPrompt.id, promptData);
      
      // Update the node in the flow
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === editingNodeId || (node.data.id === editingPrompt.id && node.type === 'prompt')) {
            return {
              ...node,
              data: {
                ...node.data,
                label: data.title,
                description: data.description.substring(0, 80) + '...',
                category: data.category.replace(/_/g, ' '),
                variables: editVariables,
              }
            };
          }
          return node;
        })
      );
      
      toast.success('Prompt updated successfully');
      setIsEditPromptModalOpen(false);
      setEditingPrompt(null);
      setEditingNodeId(null);
      setEditVariables([]);
      resetPromptEdit();
    } catch (error) {
      toast.error('Failed to update prompt');
    }
  };

  // Add event listener for edit events
  useEffect(() => {
    window.addEventListener('editNode', handleEditNode);
    return () => {
      window.removeEventListener('editNode', handleEditNode);
    };
  }, [handleEditNode]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Create instruction set connection
        const newEdge = {
          ...params,
          id: `custom-${params.source}-${params.target}`,
          type: 'default',
          animated: true,
          style: { stroke: '#f59e0b', strokeWidth: 3 },
          label: 'Instruction Set',
        };
        setEdges((eds) => addEdge(newEdge, eds));
        
        // Update instruction sets
        setInstructionSets(prev => {
          const setId = `set-${Date.now()}`;
          return {
            ...prev,
            [setId]: [params.source!, params.target!]
          };
        });
      }
    },
    [setEdges]
  );

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      nodesToDelete.forEach(node => {
        const nodeType = node.type === 'instruction' ? 'instruction' : 
                        node.type === 'prompt' ? 'prompt' : 
                        node.type === 'connector' ? 'connector' : 'node';
        toast.success(`Removed ${nodeType} "${node.data.label || 'node'}" from flow`);
      });
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instructionsResponse, promptsResponse] = await Promise.all([
        instructionsApi.getAll({ limit: 50 }),
        promptsApi.getAll({ limit: 50 }),
      ]);

      const instructionsList = instructionsResponse.data;
      const promptsList = promptsResponse.data;

      setInstructions(instructionsList);
      setPrompts(promptsList);

      // Check if we should load a specific collection
      const collectionId = searchParams.get('collection');
      if (collectionId) {
        await loadCollection(collectionId, instructionsList, promptsList);
      } else {
        // Start with empty flow - users can drag items from catalog
        setNodes([]);
        setEdges([]);
        setCurrentCollection(null);
      }
    } catch (error) {
      toast.error('Failed to fetch data for visualization');
    } finally {
      setLoading(false);
    }
  };

  const loadCollection = async (collectionId: string, instructionsList: Instruction[], promptsList: Prompt[]) => {
    // Load saved collections from localStorage
    const savedCollections: Collection[] = JSON.parse(localStorage.getItem('savedCollections') || '[]');
    
    // Mock collections data (in real app, this would be an API call)
    const mockCollections: Collection[] = [
      {
        id: '1',
        name: 'AI Development Workflow',
        description: 'Complete workflow for AI development including Gemini integration, document management, and API development.',
        instructions: ['7', '5'], // Gemini Gem Development Guide, API Design Best Practices
        prompts: ['3', '6'], // Knowledge Document Location Picker, Gemini API Integration
        connections: [
          { from: 'prompt-3', to: 'instruction-7', type: 'instruction' },
          { from: 'instruction-7', to: 'prompt-6', type: 'prompt' },
          { from: 'prompt-6', to: 'instruction-5', type: 'instruction' }
        ],
        tags: ['ai-development', 'gemini', 'api-integration'],
        isPublic: true,
        createdAt: '2024-10-01T10:00:00Z',
        updatedAt: '2024-10-07T14:30:00Z',
        createdBy: 'AI Development Team',
        usageCount: 45
      },
      {
        id: '2',
        name: 'Software Development Best Practices',
        description: 'Comprehensive collection for software development including code review, API design, and project planning.',
        instructions: ['3', '4', '5'], // Code Review Checklist, Agile Sprint Planning Guide, API Design Best Practices
        prompts: ['1', '3'], // React Component Generator, Code Analysis & Review
        connections: [
          { from: 'instruction-4', to: 'prompt-1', type: 'prompt' },
          { from: 'prompt-1', to: 'prompt-3', type: 'prompt' },
          { from: 'prompt-3', to: 'instruction-3', type: 'instruction' },
          { from: 'instruction-3', to: 'instruction-5', type: 'instruction' }
        ],
        tags: ['software-development', 'best-practices', 'agile'],
        isPublic: true,
        createdAt: '2024-09-28T15:20:00Z',
        updatedAt: '2024-10-02T09:15:00Z',
        createdBy: 'Engineering Team',
        usageCount: 23
      },
      {
        id: '3',
        name: 'Business Strategy & Product Design',
        description: 'End-to-end collection for business strategy development and product design workflows.',
        instructions: ['1', '2', '6'], // Business Strategy Framework, Product Requirements Document, UI/UX Design Principles
        prompts: ['4', '5', '7'], // Competitive Analysis, Market Trends Research, User Demographics Study
        connections: [
          { from: 'prompt-4', to: 'prompt-5', type: 'prompt' },
          { from: 'prompt-5', to: 'prompt-7', type: 'prompt' },
          { from: 'prompt-7', to: 'instruction-1', type: 'instruction' },
          { from: 'instruction-1', to: 'instruction-2', type: 'instruction' },
          { from: 'instruction-2', to: 'instruction-6', type: 'instruction' }
        ],
        tags: ['business-strategy', 'product-design', 'ui-ux'],
        isPublic: false,
        createdAt: '2024-09-25T11:45:00Z',
        updatedAt: '2024-09-30T16:20:00Z',
        createdBy: 'Product Team',
        usageCount: 12
      }
    ];

    // Combine both saved and mock collections
    const allCollections = [...savedCollections, ...mockCollections];
    const collection = allCollections.find(c => c.id === collectionId);
    
    if (!collection) {
      toast.error('Collection not found');
      return;
    }

    setCurrentCollection(collection);

    // Create nodes for instructions and prompts in the collection
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    
    let xOffset = 100;
    let yOffset = 100;

    // Add instruction nodes
    collection.instructions.forEach((instructionId, index) => {
      const instruction = instructionsList.find(i => i.id === instructionId);
      if (instruction) {
        flowNodes.push({
          id: `instruction-${instruction.id}`,
          type: 'instruction',
          position: { 
            x: xOffset + (index % 2) * 300, 
            y: yOffset + Math.floor(index / 2) * 200 
          },
          data: {
            label: instruction.title,
            description: instruction.description.substring(0, 80) + '...',
            category: instruction.category.replace(/_/g, ' '),
            id: instruction.id,
            tags: instruction.tags,
            isPublic: instruction.isPublic,
          },
          connectable: true,
        });
      }
    });

    // Add prompt nodes
    collection.prompts.forEach((promptId, index) => {
      const prompt = promptsList.find(p => p.id === promptId);
      if (prompt) {
        flowNodes.push({
          id: `prompt-${prompt.id}`,
          type: 'prompt',
          position: { 
            x: xOffset + 350 + (index % 2) * 300, 
            y: yOffset + Math.floor(index / 2) * 200 
          },
          data: {
            label: prompt.title,
            description: prompt.description.substring(0, 80) + '...',
            category: prompt.category.replace(/_/g, ' '),
            id: prompt.id,
            variables: prompt.variables,
            tags: prompt.tags,
            isPublic: prompt.isPublic,
          },
          connectable: true,
        });
      }
    });

    // Add connections from the collection
    collection.connections.forEach((connection, index) => {
      flowEdges.push({
        id: `collection-edge-${index}`,
        source: connection.from,
        target: connection.to,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        label: 'Collection Flow',
      });
    });

    // Apply saved node positions if available
    if (collection.nodePositions && collection.nodePositions.length > 0) {
      console.log('Loading collection with saved positions:', collection.nodePositions);
      console.log('Flow nodes created:', flowNodes.map(n => ({ id: n.id, type: n.type })));
      
      // Also restore any connector nodes that were saved
      const savedConnectorNodes = collection.nodePositions
        .filter(pos => pos.type === 'connector')
        .map(pos => ({
          id: pos.id,
          type: 'connector' as const,
          position: { x: pos.x, y: pos.y },
          data: {
            label: 'Connector',
          },
          connectable: true,
        }));
      
      const positionedNodes = [...flowNodes, ...savedConnectorNodes].map(node => {
        // Try multiple ID matching strategies
        const savedPosition = collection.nodePositions?.find(pos => {
          // Direct ID match
          if (pos.id === node.id) return true;
          
          // For instructions/prompts, also try matching with data ID
          if (node.type === 'instruction' || node.type === 'prompt') {
            const dataIdMatch = pos.id === `${node.type}-${node.data.id}`;
            const baseIdMatch = pos.id.startsWith(`${node.type}-${node.data.id}-`);
            return dataIdMatch || baseIdMatch;
          }
          
          return false;
        });
        
        if (savedPosition) {
          console.log(`Matched position for node ${node.id}:`, savedPosition);
          return {
            ...node,
            position: { x: savedPosition.x, y: savedPosition.y }
          };
        }
        
        console.log(`No position found for node ${node.id}`);
        return node;
      });
      
      setNodes(positionedNodes);
      setEdges(flowEdges);
      toast.success(`Loaded collection: ${collection.name} with ${collection.nodePositions.length} saved positions`);
    } else {
      setNodes(flowNodes);
      setEdges(flowEdges);
      
      // Auto-apply smart layout for collections with connections
      if (flowNodes.length > 1 && flowEdges.length > 0) {
        // Apply layout after a brief delay to ensure state is updated
        setTimeout(() => {
          const layoutResult = getLayoutedElements(flowNodes, flowEdges);
          setNodes(layoutResult.nodes);
          setEdges(layoutResult.edges);
        }, 100);
      }
      toast.success(`Loaded collection: ${collection.name}`);
    }
    
    toast.success(`Loaded collection: ${collection.name}`);
  };



  const getLayoutedElements = useCallback((nodes: Node[], edges: Edge[]) => {
    // Create simple vertical layout with consistent spacing
    const centerX = 400; // Center X position for all nodes
    let currentY = 100; // Starting Y position
    const verticalSpacing = 150; // Space between nodes (increased for better readability)
    
    const layoutedNodes = nodes.map((node, index) => {
      let width = 280;
      
      // Adjust dimensions based on node type
      if (node.type === 'connector') {
        width = 140;
      }
      
      const newNode = {
        ...node,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        position: {
          x: centerX - width / 2, // Center horizontally
          y: currentY + (index * verticalSpacing), // Use consistent vertical spacing
        },
      };
      
      return newNode;
    });

    return { nodes: layoutedNodes, edges };
  }, []);

  const handleAutoLayout = () => {
    if (nodes.length === 0) {
      toast.success('No nodes to layout');
      return;
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Provide feedback about the layout
    const layoutInfo = `Applied vertical layout to ${nodes.length} nodes with 50px spacing`;
    
    toast.success(layoutInfo);
  };
  

  




  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Flow Visualization
            </h2>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:ml-4 md:mt-0">
          <Button 
            variant={catalogOpen ? "primary" : "outline"} 
            onClick={() => setCatalogOpen(!catalogOpen)}
          >
            <Menu className="mr-2 h-4 w-4" />
            {catalogOpen ? 'Close Catalog' : 'Instruction Catalog'}
          </Button>
          {nodes.length > 0 && (
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
                  setNodes(layoutedNodes);
                  setEdges(layoutedEdges);
                  toast.success('Applied vertical layout');
                }}
                title="Top to Bottom layout"
              >
                ⬇️
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
                  setNodes(layoutedNodes);
                  setEdges(layoutedEdges);
                  toast.success('Applied vertical layout');
                }}
                title="Left to Right layout"
              >
                ➡️
              </Button>
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={() => {
              if (nodes.length > 0) {
                // Extract node positions and metadata
                const nodePositions = nodes.map(node => {
                  // Use the original data ID for instructions/prompts to match during loading
                  let matchingId = node.id;
                  if (node.type === 'instruction' || node.type === 'prompt') {
                    matchingId = `${node.type}-${node.data.id}`;
                  }
                  return {
                    id: matchingId,
                    x: node.position.x,
                    y: node.position.y,
                    type: node.type as 'instruction' | 'prompt' | 'connector'
                  };
                });
                
                // Extract connections from edges
                const connections = edges.map(edge => ({
                  from: edge.source,
                  to: edge.target,
                  type: edge.source.startsWith('instruction') ? 'instruction' as const : 'prompt' as const
                }));
                
                // Create collection data
                const collectionData = {
                  id: `collection-${Date.now()}`,
                  name: `Flow Collection ${new Date().toLocaleDateString()}`,
                  description: `Custom workflow with ${nodes.length} nodes and ${edges.length} connections`,
                  instructions: nodes.filter(n => n.type === 'instruction').map(n => n.data.id || n.id),
                  prompts: nodes.filter(n => n.type === 'prompt').map(n => n.data.id || n.id),
                  connections,
                  nodePositions,
                  tags: ['custom', 'workflow'],
                  isPublic: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  createdBy: 'User',
                  usageCount: 0
                };
                
                // Store in localStorage for persistence (in real app, this would be an API call)
                const existingCollections = JSON.parse(localStorage.getItem('savedCollections') || '[]');
                existingCollections.push(collectionData);
                localStorage.setItem('savedCollections', JSON.stringify(existingCollections));
                
                toast.success(`Collection saved with ${nodes.length} nodes and their positions!`);
              } else {
                toast.error('Add some nodes to the flow first.');
              }
            }}
            disabled={nodes.length === 0}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Save as Collection
          </Button>
          {(currentCollection || nodes.length > 0) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setNodes([]);
                setEdges([]);
                setCurrentCollection(null);
                setInstructionSets({});
                // Clear URL parameter
                window.history.replaceState({}, '', '/flow');
                toast.success('Flow cleared');
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Flow
            </Button>
          )}
          <Button variant="outline" onClick={handleAutoLayout}>
            <Maximize2 className="mr-2 h-4 w-4" />
            Smart Layout
          </Button>
        </div>
      </div>

      {/* Collection Info */}
      {currentCollection ? (
        <div className="card p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">{currentCollection.name}</h3>
                {currentCollection.isPublic && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Public
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{currentCollection.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentCollection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Instructions:</span>
                  <span className="ml-1 font-medium text-blue-600">{currentCollection.instructions.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Prompts:</span>
                  <span className="ml-1 font-medium text-green-600">{currentCollection.prompts.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Connections:</span>
                  <span className="ml-1 font-medium text-purple-600">{currentCollection.connections.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Usage:</span>
                  <span className="ml-1 font-medium text-gray-700">{currentCollection.usageCount}×</span>
                </div>
              </div>
            </div>
            {catalogOpen && (
              <p className="text-xs text-gray-500 ml-4">
                💡 Drag cards from catalog above to add them to the flow
              </p>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
            <div>Created by {currentCollection.createdBy} on {new Date(currentCollection.createdAt).toLocaleDateString()}</div>
            <div>Updated {new Date(currentCollection.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      ) : (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-2">New Flow</h3>
              <p className="text-sm text-gray-600 mb-3">Create a custom workflow by dragging instructions and prompts from the catalog.</p>
            </div>
            {catalogOpen && (
              <p className="text-xs text-gray-500">
                💡 Drag cards from catalog above to add them to the flow
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded mr-2"></div>
              <span className="text-gray-600">� Instructions</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 rounded mr-2"></div>
              <span className="text-gray-600">🤖 Prompts</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-2"></div>
              <span className="text-gray-600">🔗 Connectors</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Instruction Catalog Panel - slides under navigation */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        catalogOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900">📚 Instruction Catalog</h3>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="business">Business</option>
                <option value="product">Product</option>
                <option value="software_engineering">Software Engineering</option>
                <option value="development">Development</option>
                <option value="project_management">Project Management</option>
                <option value="design">Design</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => setCatalogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="h-64 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Instructions Column */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  📋 Instructions
                  <span className="ml-2 text-xs text-gray-500">({instructions.filter(i => selectedCategory === 'all' || i.category === selectedCategory).length})</span>
                </h4>
                <div className="space-y-2">
                  {instructions
                    .filter(instruction => selectedCategory === 'all' || instruction.category === selectedCategory)
                    .map((instruction) => (
                      <div 
                        key={instruction.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify({
                            type: 'instruction',
                            data: instruction
                          }));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group bg-gradient-to-r from-blue-50 to-blue-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {instruction.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {instruction.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                                {instruction.category.replace(/_/g, ' ')}
                              </span>
                              {instruction.isPublic && (
                                <span className="text-xs text-green-600">📢 Public</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                            Drag to add
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Prompts Column */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  🤖 Prompts
                  <span className="ml-2 text-xs text-gray-500">({prompts.length})</span>
                </h4>
                <div className="space-y-2">
                  {prompts.map((prompt) => (
                    <div 
                      key={prompt.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({
                          type: 'prompt',
                          data: prompt
                        }));
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group bg-gradient-to-r from-green-50 to-emerald-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                            {prompt.title}
                          </h5>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {prompt.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                              {prompt.category.replace(/_/g, ' ')}
                            </span>
                            {prompt.variables && prompt.variables.length > 0 && (
                              <span className="text-xs text-purple-600">🔧 {prompt.variables.length} vars</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-green-500 transition-colors">
                          Drag to add
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Flow Container */}
      <div 
        className={`card p-0 overflow-hidden transition-all duration-300 ${catalogOpen ? 'ml-0' : ''}`} 
        style={{ height: 'calc(100vh - 460px)', minHeight: '400px' }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => {
          e.preventDefault();
          try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - 110; // Adjust for node width
            const y = e.clientY - rect.top - 50;   // Adjust for node height
            
            if (data.type === 'instruction') {
              const newNode: Node = {
                id: `instruction-${data.data.id}-${Date.now()}`,
                type: 'instruction',
                position: { x: Math.max(50, x), y: Math.max(50, y) },
                data: {
                  label: data.data.title,
                  description: data.data.description.substring(0, 80) + '...',
                  category: data.data.category.replace(/_/g, ' '),
                  id: data.data.id,
                  tags: data.data.tags,
                  isPublic: data.data.isPublic,
                },
                connectable: true,
              };
              setNodes(prev => [...prev, newNode]);
              toast.success(`Added "${data.data.title}" to flow at position`);
            } else if (data.type === 'prompt') {
              const newNode: Node = {
                id: `prompt-${data.data.id}-${Date.now()}`,
                type: 'prompt',
                position: { x: Math.max(50, x), y: Math.max(50, y) },
                data: {
                  label: data.data.title,
                  description: data.data.description.substring(0, 80) + '...',
                  category: data.data.category.replace(/_/g, ' '),
                  id: data.data.id,
                  variables: data.data.variables,
                  tags: data.data.tags,
                  isPublic: data.data.isPublic,
                },
                connectable: true,
              };
              setNodes(prev => [...prev, newNode]);
              toast.success(`Added "${data.data.title}" to flow at position`);
            }
          } catch (error) {
            console.error('Error parsing dropped data:', error);
          }
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          deleteKeyCode={['Backspace', 'Delete']}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background />
          <Controls />
          <MiniMap 
            style={{ height: 120 }}
            zoomable
            pannable
            nodeColor={(node) => {
              if (node.type === 'instruction') return '#dbeafe';
              if (node.type === 'prompt') return '#dcfce7';
              return '#f3f4f6';
            }}
          />
          <Panel position="top-right">
            <div className="bg-white p-2 rounded shadow-md">
              <p className="text-xs text-gray-600">
                {nodes.length} Nodes • {edges.length} Connections
              </p>
              <p className="text-xs text-gray-500">
                Available: {instructions.length} Instructions • {prompts.length} Prompts
              </p>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Instruction Sets */}
      {Object.keys(instructionSets).length > 0 ? (
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🔗 Created Instruction Sets</h3>
          <div className="space-y-2">
            {Object.entries(instructionSets).map(([setId, nodeIds]) => (
              <div key={setId} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    📚 Instruction Set: {nodeIds.length} connected nodes
                  </span>
                  <div className="text-xs text-gray-600 mt-1">
                    Connected in sequence: {nodeIds.map(id => {
                      const node = nodes.find(n => n.id === id);
                      return node?.data.label.substring(0, 20) + '...';
                    }).join(' → ')}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setInstructionSets(prev => {
                      const newSets = { ...prev };
                      delete newSets[setId];
                      return newSets;
                    });
                    // Remove edges for this set
                    setEdges(prev => prev.filter(edge => !edge.id.includes(setId.replace('set-', 'set-'))));
                    toast.success('Instruction set removed');
                  }}
                >
                  🗑️ Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Edit Instruction Modal */}
      <Modal
        isOpen={isEditInstructionModalOpen}
        onClose={() => {
          setIsEditInstructionModalOpen(false);
          setEditingInstruction(null);
          setEditingNodeId(null);
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
            options={Object.values(InstructionCategory).map((category) => ({
              value: category,
              label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            }))}
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
                setEditingNodeId(null);
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
          setEditingNodeId(null);
          setEditVariables([]);
          resetPromptEdit();
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
            options={Object.values(PromptCategory).map((category) => ({
              value: category,
              label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            }))}
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
            
            {editVariables.map((variable, index) => (
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
                setEditingNodeId(null);
                setEditVariables([]);
                resetPromptEdit();
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

export default FlowVisualization;