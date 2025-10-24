import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { CollectionModal } from '../components/collections/CollectionModal';
import { instructionsApi, promptsApi, collectionApi } from '../api/services';
import { Instruction, Prompt, Collection } from '../types';
import toast from 'react-hot-toast';
import { Maximize2, X, Trash2, FolderOpen, Edit } from 'lucide-react';


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
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-orange-600 border border-white"
        style={{ bottom: -4 }}
      />
    </div>
  );
};

// Flow visualization component
const FlowVisualization: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  

  // Memoize node types to prevent React Flow warning
  const nodeTypes = useMemo(() => ({
    instruction: InstructionNode,
    prompt: PromptNode,
    connector: ConnectorNode,
  }), []);

  // Memoize edge types to prevent React Flow warning
  const edgeTypes = useMemo(() => ({}), []);

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
    try {
      // Try to fetch from API first
      let collection: Collection | null = null;
      try {
        const apiResponse = await collectionApi.getById(collectionId);
        const apiCollection = apiResponse.data;
        
        console.log('API collection response:', apiCollection);
        console.log('API items:', apiCollection.items);
        
        // Convert API format to our internal format
        collection = {
          id: apiCollection.id,
          name: apiCollection.title,
          description: apiCollection.description,
          instructions: apiCollection.items?.filter((i: any) => i.type === 'instruction').map((i: any) => {
            console.log('Instruction item:', i, 'itemId:', i.itemId);
            return i.itemId;
          }) || [],
          prompts: apiCollection.items?.filter((i: any) => i.type === 'prompt').map((i: any) => {
            console.log('Prompt item:', i, 'itemId:', i.itemId);
            return i.itemId;
          }) || [],
          connections: [],
          nodePositions: undefined,
          tags: apiCollection.tags || [],
          isPublic: apiCollection.isPublic,
          createdAt: apiCollection.createdAt,
          updatedAt: apiCollection.updatedAt,
          createdBy: apiCollection.userId || 'Unknown',
          usageCount: 0,
          rating: apiCollection.rating?.average
        } as Collection;
      } catch (apiError) {
        // If API fails, fall back to localStorage
        console.log('API fetch failed, checking localStorage:', apiError);
        
        const savedCollections: Collection[] = JSON.parse(localStorage.getItem('savedCollections') || '[]');
        collection = savedCollections.find(c => c.id === collectionId) || null;
      }

      // Check if collection was found
      if (!collection) {
        toast.error('Collection not found');
        return;
      }

      setCurrentCollection(collection);

      // Fetch the specific instructions and prompts for this collection
      const collectionInstructions: Instruction[] = [];
      const collectionPrompts: Prompt[] = [];

      // Fetch instructions that are in the collection
      for (const instructionId of collection.instructions) {
        // First check if it's in the already-fetched list
        const existing = instructionsList.find(i => i.id === instructionId);
        if (existing) {
          collectionInstructions.push(existing);
        } else {
          // If not found, try to fetch it individually
          try {
            const response = await instructionsApi.getById(instructionId);
            collectionInstructions.push(response.data);
          } catch (err) {
            console.warn(`Could not fetch instruction ${instructionId}:`, err);
          }
        }
      }

      // Fetch prompts that are in the collection
      for (const promptId of collection.prompts) {
        // First check if it's in the already-fetched list
        const existing = promptsList.find(p => p.id === promptId);
        if (existing) {
          collectionPrompts.push(existing);
        } else {
          // If not found, try to fetch it individually
          try {
            const response = await promptsApi.getById(promptId);
            collectionPrompts.push(response.data);
          } catch (err) {
            console.warn(`Could not fetch prompt ${promptId}:`, err);
          }
        }
      }

      // Create nodes for instructions and prompts in the collection
      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];
      
      let xOffset = 100;
      let yOffset = 100;

      // Add instruction nodes
      collectionInstructions.forEach((instruction, index) => {
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
      });

      // Add prompt nodes
      collectionPrompts.forEach((prompt, index) => {
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
      });

      // Add connections from the collection
      (collection.connections || []).forEach((connection, index) => {
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

      // Try to load layout data from localStorage
      let savedLayoutData: any = null;
      try {
        const layoutDataStr = localStorage.getItem(`collection-layout-${collection.id}`);
        if (layoutDataStr) {
          savedLayoutData = JSON.parse(layoutDataStr);
          console.log('Loaded layout data from localStorage:', savedLayoutData);
        }
      } catch (err) {
        console.warn('Failed to load layout data from localStorage:', err);
      }

      // Apply saved node positions if available
      if (collection.nodePositions && collection.nodePositions.length > 0) {
        console.log('Loading collection with saved positions:', collection.nodePositions);
        console.log('Flow nodes created:', flowNodes.map(n => ({ id: n.id, type: n.type })));
        
        // Also restore any connector nodes that were saved
        const savedConnectorNodes = (collection.nodePositions || [])
          .filter((pos: any) => pos.type === 'connector')
          .map((pos: any) => ({
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
          const savedPosition = (collection.nodePositions || []).find((pos: any) => {
            // Direct ID match
            if (pos.id === node.id) return true;
            
            // For instructions/prompts, also try matching with data ID
            if (node.type === 'instruction' || node.type === 'prompt') {
              const dataIdMatch = pos.id === `${node.type}-${(node.data as any).id}`;
              const baseIdMatch = pos.id.startsWith(`${node.type}-${(node.data as any).id}-`);
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
        
        // Use localStorage layout data if available, otherwise use collection data
        const finalEdges = savedLayoutData?.connections?.length > 0 
          ? savedLayoutData.connections.map((conn: any, index: number) => ({
              id: `edge-${index}`,
              source: conn.from,
              target: conn.to,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8b5cf6', strokeWidth: 2 },
              label: 'Collection Flow',
            }))
          : flowEdges;

        setNodes(positionedNodes);
        setEdges(finalEdges);
        toast.success(`Loaded collection: ${collection.name} (${positionedNodes.length} nodes, ${finalEdges.length} connections)`);
      } else if (savedLayoutData?.nodePositions && savedLayoutData.nodePositions.length > 0) {
        // Use localStorage node positions if collection doesn't have saved positions
        const positionedNodes = flowNodes.map(node => {
          const savedPosition = savedLayoutData.nodePositions.find((pos: any) => pos.id === node.id);
          if (savedPosition) {
            return {
              ...node,
              position: { x: savedPosition.x, y: savedPosition.y }
            };
          }
          return node;
        });

        const finalEdges = savedLayoutData.connections?.length > 0 
          ? savedLayoutData.connections.map((conn: any, index: number) => ({
              id: `edge-${index}`,
              source: conn.from,
              target: conn.to,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8b5cf6', strokeWidth: 2 },
              label: 'Collection Flow',
            }))
          : flowEdges;

        setNodes(positionedNodes);
        setEdges(finalEdges);
        toast.success(`Loaded collection: ${collection.name} (${positionedNodes.length} nodes, ${finalEdges.length} connections)`);
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
        toast.success(`Loaded collection: ${collection.name} (${flowNodes.length} nodes)`);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
      toast.error('Failed to load collection');
    }
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

  const handleSaveCollection = async (data?: Partial<Collection>) => {
    try {
      if (nodes.length === 0) {
        toast.error('Add nodes to the flow before saving as a collection');
        return;
      }

      // Build items array from nodes
      const items = nodes
        .filter(n => n.type === 'instruction' || n.type === 'prompt')
        .map((node, _index) => ({
          type: node.type as 'instruction' | 'prompt',
          itemId: node.data.id || node.id,
          order: _index
        }));

      // Build connections from edges
      const connections = edges.map((edge, _index) => ({
        from: edge.source,
        to: edge.target,
        type: (edge.target.startsWith('instruction') ? 'instruction' : 'prompt') as 'instruction' | 'prompt'
      }));

      // Collect node positions
      const nodePositions = nodes.map(node => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        type: node.type as 'instruction' | 'prompt' | 'connector'
      }));

      // Create collection data matching API requirements
      const collectionData = {
        title: data?.name || currentCollection?.name || 'Untitled Collection',
        description: data?.description || currentCollection?.description || `Flow collection with ${nodes.length} items`,
        tags: data?.tags || currentCollection?.tags || [],
        isPublic: data?.isPublic !== undefined ? data.isPublic : (currentCollection?.isPublic || false),
        items
      };

      // Save layout data to localStorage alongside the collection
      const layoutData = {
        connections,
        nodePositions
      };
      localStorage.setItem(`collection-layout-${currentCollection?.id || 'new'}`, JSON.stringify(layoutData));

      // Check if we're updating an existing collection or creating a new one
      if (currentCollection?.id) {
        // Update existing collection
        await collectionApi.updateCollection(currentCollection.id, collectionData);
        toast.success(`Collection "${collectionData.title}" updated successfully!`);
      } else {
        // Create new collection
        const response = await collectionApi.createCollection(collectionData);
        // Save layout for the newly created collection
        localStorage.setItem(`collection-layout-${response.id}`, JSON.stringify(layoutData));
        setCurrentCollection(response);
        toast.success(`Collection "${collectionData.title}" saved successfully!`);
      }
      
      setShowCollectionModal(false);
    } catch (error: any) {
      console.error('Error saving collection:', error);
      const errorMessage = error?.response?.data?.details?.[0]?.msg || error?.message || 'Failed to save collection';
      toast.error(errorMessage);
    }
  };

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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Flow Visualization
            </h2>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:ml-4 md:mt-0">
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
              if (currentCollection?.id) {
                // Direct save for existing collections without modal
                handleSaveCollection();
              } else {
                // Show modal for new collections
                setShowCollectionModal(true);
              }
            }}
            disabled={nodes.length === 0}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            {currentCollection?.id ? 'Save Collection' : 'Save as Collection'}
          </Button>
          {(currentCollection || nodes.length > 0) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setNodes([]);
                setEdges([]);
                setCurrentCollection(null);
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
      
      {/* Main Content Wrapper - flex layout with sidebar */}
      <div className="flex flex-1 gap-4 overflow-hidden pb-28 pr-4">
        {/* Instruction Catalog Panel - always visible sidebar */}
        <div className="w-96 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl rounded-r-xl overflow-hidden flex flex-col">
          {/* Category Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">Filter by Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all">All Categories</option>
              <option value="business">Business</option>
              <option value="product">Product</option>
              <option value="AGENTIC_AI">Software Engineering</option>
              <option value="development">Development</option>
              <option value="project_management">Project Management</option>
              <option value="design">Design</option>
            </select>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Instructions Column */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  📋 Instructions
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({instructions.filter(i => selectedCategory === 'all' || i.category === selectedCategory).length})</span>
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
                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-blue-900/20 transition-all cursor-grab active:cursor-grabbing group bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {instruction.title}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {instruction.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="px-2 py-1 text-xs bg-blue-500 dark:bg-blue-600 text-white rounded-full">
                                {instruction.category.replace(/_/g, ' ')}
                              </span>
                              {instruction.isPublic && (
                                <span className="text-xs text-green-600 dark:text-green-400">📢 Public</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
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
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  🤖 Prompts
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({prompts.length})</span>
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
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-500 hover:shadow-md dark:hover:shadow-green-900/20 transition-all cursor-grab active:cursor-grabbing group bg-gradient-to-r from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {prompt.title}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {prompt.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="px-2 py-1 text-xs bg-green-500 dark:bg-green-600 text-white rounded-full">
                              {prompt.category.replace(/_/g, ' ')}
                            </span>
                            {prompt.variables && prompt.variables.length > 0 && (
                              <span className="text-xs text-purple-600 dark:text-purple-400">🔧 {prompt.variables.length} vars</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
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
        
        {/* Flow Container */}
        <div 
          className="card p-0 overflow-hidden flex-1"
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
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          deleteKeyCode={['Backspace', 'Delete']}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 0.75, minZoom: 0.75 }}
          className=""
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
      </div>

      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        editingCollection={null}
        onSave={handleSaveCollection}
      />
    </div>
  );
};

export default FlowVisualization;