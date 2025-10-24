import React from 'react';
import { motion } from 'framer-motion';
import { CollectionCard } from './CollectionCard';
import type { Collection } from '../../types';

interface CollectionGridProps {
  collections: Collection[];
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
  onDuplicate: (collection: Collection) => void;
  onToggleVisibility: (id: string) => void;
  getInstructionTitle: (id: string) => string;
  getPromptTitle: (id: string) => string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  getInstructionTitle,
  getPromptTitle
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection, index) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={{ y: -5 }}
        >
          <CollectionCard
            collection={collection}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleVisibility={onToggleVisibility}
            getInstructionTitle={getInstructionTitle}
            getPromptTitle={getPromptTitle}
          />
        </motion.div>
      ))}
    </div>
  );
};