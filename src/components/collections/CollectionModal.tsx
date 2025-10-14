import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { StarRating } from '../ui/StarRating';

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

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCollection: Collection | null;
  onSave: (data: Partial<Collection>) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  editingCollection,
  onSave
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    tags: '',
    isPublic: false,
    rating: 0
  });

  React.useEffect(() => {
    if (editingCollection) {
      setFormData({
        name: editingCollection.name,
        description: editingCollection.description,
        tags: editingCollection.tags.join(', '),
        isPublic: editingCollection.isPublic,
        rating: editingCollection.rating || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        tags: '',
        isPublic: false,
        rating: 0
      });
    }
  }, [editingCollection, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublic: formData.isPublic,
      rating: formData.rating
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCollection ? 'Edit Collection' : 'Create New Collection'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Collection Name
          </label>
          <Input
            type="text"
            placeholder="Enter collection name..."
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400"
            rows={3}
            placeholder="Describe this collection..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags (comma-separated)
          </label>
          <Input
            type="text"
            placeholder="tag1, tag2, tag3..."
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating: number) => setFormData(prev => ({ ...prev, rating }))}
            size="md"
            showValue
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-800"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
            Make this collection public
          </label>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose}
            className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
          >
            {editingCollection ? 'Update' : 'Create'} Collection
          </Button>
        </div>
      </form>
    </Modal>
  );
};