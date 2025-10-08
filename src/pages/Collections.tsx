import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Share2,
  Copy,
  GitBranch,
  Users,
  Eye,
  EyeOff,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

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
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

const Collections: React.FC = () => {
  const { instructions, prompts } = useAppStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock collections data
  useEffect(() => {
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

    setCollections(mockCollections);
    setFilteredCollections(mockCollections);
    setLoading(false);
  }, []);

  // Filter collections based on search and category
  useEffect(() => {
    let filtered = collections;

    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(collection =>
        collection.tags.includes(selectedCategory)
      );
    }

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedCategory]);

  const handleCreateCollection = () => {
    setEditingCollection(null);
    setShowCreateModal(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setShowCreateModal(true);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    toast.success('Collection deleted successfully');
  };

  const handleDuplicateCollection = (collection: Collection) => {
    const newCollection: Collection = {
      ...collection,
      id: Date.now().toString(),
      name: `${collection.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    setCollections(prev => [...prev, newCollection]);
    toast.success('Collection duplicated successfully');
  };

  const handleToggleVisibility = (id: string) => {
    setCollections(prev => 
      prev.map(c => 
        c.id === id ? { ...c, isPublic: !c.isPublic } : c
      )
    );
    toast.success('Visibility updated');
  };

  const getInstructionTitle = (id: string) => {
    const instruction = instructions.find(i => i.id === id);
    return instruction?.title || `Instruction ${id}`;
  };

  const getPromptTitle = (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    return prompt?.title || `Prompt ${id}`;
  };

  if (loading) {
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
            Collections
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Organize and manage connected instructions and prompts from your flow visualizations.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button onClick={handleCreateCollection}>
            <Plus className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="product-discovery">Product Discovery</option>
              <option value="requirements">Requirements</option>
              <option value="user-research">User Research</option>
              <option value="planning">Planning</option>
              <option value="documentation">Documentation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCollections.map((collection) => (
          <div key={collection.id} className="card p-6 hover:shadow-lg transition-shadow">
            {/* Collection Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {collection.name}
                  </h3>
                  {collection.isPublic ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {collection.description}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => handleEditCollection(collection)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Edit collection"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDuplicateCollection(collection)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Duplicate collection"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleVisibility(collection.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title={collection.isPublic ? 'Make private' : 'Make public'}
                >
                  {collection.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Delete collection"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Collection Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary-600">
                  {collection.instructions.length}
                </div>
                <div className="text-xs text-gray-500">Instructions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {collection.prompts.length}
                </div>
                <div className="text-xs text-gray-500">Prompts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {collection.connections.length}
                </div>
                <div className="text-xs text-gray-500">Connections</div>
              </div>
            </div>

            {/* Collection Items Preview */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Items:</div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {collection.instructions.slice(0, 2).map(id => (
                  <div key={`inst-${id}`} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 truncate">{getInstructionTitle(id)}</span>
                  </div>
                ))}
                {collection.prompts.slice(0, 2).map(id => (
                  <div key={`prompt-${id}`} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 truncate">{getPromptTitle(id)}</span>
                  </div>
                ))}
                {(collection.instructions.length + collection.prompts.length) > 4 && (
                  <div className="text-xs text-gray-400">
                    +{(collection.instructions.length + collection.prompts.length) - 4} more items
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {collection.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
              {collection.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{collection.tags.length - 3} more</span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {collection.usageCount} uses
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(collection.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/flow?collection=${collection.id}`}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <GitBranch className="h-3 w-3" />
                  View Flow
                </Link>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No collections found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'Create your first collection by connecting instructions and prompts in the flow visualization.'
            }
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateCollection}>
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editingCollection ? 'Edit Collection' : 'Create New Collection'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name
            </label>
            <Input
              type="text"
              placeholder="Enter collection name..."
              defaultValue={editingCollection?.name || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Describe this collection..."
              defaultValue={editingCollection?.description || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              placeholder="tag1, tag2, tag3..."
              defaultValue={editingCollection?.tags.join(', ') || ''}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              defaultChecked={editingCollection?.isPublic || false}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this collection public
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowCreateModal(false);
              toast.success(editingCollection ? 'Collection updated!' : 'Collection created!');
            }}>
              {editingCollection ? 'Update' : 'Create'} Collection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Collections;