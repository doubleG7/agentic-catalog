import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { CollectionsHeader } from '../components/collections/CollectionsHeader';
import { CollectionFilters } from '../components/collections/CollectionFilters';
import { CollectionGrid } from '../components/collections/CollectionGrid';
import { CollectionEmptyState } from '../components/collections/CollectionEmptyState';
import { CollectionModal } from '../components/collections/CollectionModal';
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
  rating?: number;
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
        usageCount: 45,
        rating: 4.5
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
        usageCount: 23,
        rating: 4.0
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
        usageCount: 12,
        rating: 3.5
      }
    ];

    setCollections(mockCollections);
    setFilteredCollections(mockCollections);
    setLoading(false);
  }, []);

  // Filter collections based on search and category, sorted by highest ratings
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

    // Sort by highest rating
    filtered.sort((a, b) => {
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;
      return bRating - aRating;
    });

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
      usageCount: 0,
      rating: 0
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

  const handleSaveCollection = (data: Partial<Collection>) => {
    if (editingCollection) {
      setCollections(prev =>
        prev.map(c =>
          c.id === editingCollection.id
            ? { ...c, ...data, updatedAt: new Date().toISOString() }
            : c
        )
      );
      toast.success('Collection updated successfully');
    } else {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: data.name || '',
        description: data.description || '',
        instructions: [],
        prompts: [],
        connections: [],
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        usageCount: 0,
        rating: data.rating || 0
      };
      setCollections(prev => [...prev, newCollection]);
      toast.success('Collection created successfully');
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
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
      <CollectionsHeader onCreateCollection={handleCreateCollection} />
      
      <CollectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredCollections.length === 0 ? (
        <CollectionEmptyState
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onCreateCollection={handleCreateCollection}
        />
      ) : (
        <CollectionGrid
          collections={filteredCollections}
          onEdit={handleEditCollection}
          onDelete={handleDeleteCollection}
          onDuplicate={handleDuplicateCollection}
          onToggleVisibility={handleToggleVisibility}
          getInstructionTitle={getInstructionTitle}
          getPromptTitle={getPromptTitle}
        />
      )}

      <CollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        editingCollection={editingCollection}
        onSave={handleSaveCollection}
      />
    </motion.div>
  );
};

export default Collections;