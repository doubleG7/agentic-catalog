import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { CollectionsHeader } from '../components/collections/CollectionsHeader';
import { CollectionFilters } from '../components/collections/CollectionFilters';
import { CollectionGrid } from '../components/collections/CollectionGrid';
import { CollectionEmptyState } from '../components/collections/CollectionEmptyState';
import { CollectionModal } from '../components/collections/CollectionModal';
import { collectionApi } from '../api/services';
import toast from 'react-hot-toast';
import type { Collection } from '../types';

const Collections: React.FC = () => {
  const { instructions, prompts } = useAppStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const data = await collectionApi.getAllCollections();
        // Ensure data is an array
        const collectionsArray = Array.isArray(data) ? data : ((data as any)?.data || []);
        setCollections(collectionsArray);
      } catch (error) {
        console.error('Error fetching collections:', error);
        toast.error('Failed to load collections');
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Filter collections based on search and category, sorted by highest ratings
  useEffect(() => {
    if (!Array.isArray(collections)) {
      setFilteredCollections([]);
      return;
    }

    let filtered = [...collections];

    if (searchTerm) {
      filtered = filtered.filter(collection =>
        (collection.name || collection.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      const aRating = typeof a.rating === 'number' ? a.rating : (a.rating?.average || 0);
      const bRating = typeof b.rating === 'number' ? b.rating : (b.rating?.average || 0);
      return bRating - aRating;
    });

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedCategory]);

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setShowCreateModal(true);
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await collectionApi.deleteCollection(id);
      setCollections(prev => prev.filter(c => c.id !== id));
      toast.success('Collection deleted successfully');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const handleDuplicateCollection = (collection: Collection) => {
    const newCollection: Collection = {
      ...collection,
      id: Date.now().toString(),
      name: `${collection.name || collection.title} (Copy)`,
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

  const handleSaveCollection = async (data: Partial<Collection>) => {
    try {
      const updated = await collectionApi.updateCollection(editingCollection!.id, data);
      setCollections(prev =>
        prev.map(c => c.id === editingCollection!.id ? updated : c)
      );
      toast.success('Collection updated successfully');
      setShowCreateModal(false);
      setEditingCollection(null);
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error('Failed to save collection');
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
      <CollectionsHeader onCreateCollection={undefined} />
      
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
          onCreateCollection={undefined}
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