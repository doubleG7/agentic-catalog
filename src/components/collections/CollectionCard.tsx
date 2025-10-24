import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit2,
  Trash2,
  Copy,
  GitBranch,
  Users,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  Share2
} from 'lucide-react';
import { RatingDisplay } from '../ui/RatingDisplay';
import type { Collection } from '../../types';

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
  onDuplicate: (collection: Collection) => void;
  onToggleVisibility: (id: string) => void;
  getInstructionTitle: (id: string) => string;
  getPromptTitle: (id: string) => string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  getInstructionTitle,
  getPromptTitle,
}) => {
  // Support both old format (instructions/prompts/connections) and new format (items)
  const instructions = collection.instructions || collection.items?.filter((i: any) => i.type === 'instruction').map((i: any) => i.itemId) || [];
  const prompts = collection.prompts || collection.items?.filter((i: any) => i.type === 'prompt').map((i: any) => i.itemId) || [];
  const connections = collection.connections || [];
  return (
    <div className="card bg-white/80 dark:bg-gray-800/80 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Collection Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {collection.title || collection.name}
            </h3>
            {collection.isPublic ? (
              <Eye className="h-4 w-4 text-green-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {collection.description}
          </p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onEdit(collection)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400 rounded border"
            title="Edit collection"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDuplicate(collection)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400 rounded border"
            title="Duplicate collection"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleVisibility(collection.id)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400 rounded border"
            title={collection.isPublic ? 'Make private' : 'Make public'}
          >
            {collection.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onDelete(collection.id)}
            className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-red-600 hover:bg-gray-100 hover:border-gray-500 hover:text-red-700 dark:bg-gray-700 dark:border-gray-500 dark:text-red-400 dark:hover:bg-gray-600 dark:hover:border-gray-400 dark:hover:text-red-300 focus:font-bold focus:border-2 focus:border-red-500 dark:focus:border-red-400 rounded border"
            title="Delete collection"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <RatingDisplay rating={typeof collection.rating === 'number' ? collection.rating : collection.rating?.average || 0} size="sm" />
      </div>

      {/* Collection Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {instructions.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Instructions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {prompts.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Prompts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {connections.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Connections</div>
        </div>
      </div>

      {/* Collection Items Preview */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items:</div>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {instructions.slice(0, 2).map(id => (
            <div key={`inst-${id}`} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 truncate">{getInstructionTitle(id)}</span>
            </div>
          ))}
          {prompts.slice(0, 2).map(id => (
            <div key={`prompt-${id}`} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 truncate">{getPromptTitle(id)}</span>
            </div>
          ))}
          {(instructions.length + prompts.length) > 4 && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              +{(instructions.length + prompts.length) - 4} more items
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {(collection.tags || []).slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </span>
        ))}
        {(collection.tags?.length || 0) > 3 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">+{(collection.tags?.length || 0) - 3} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {collection.usageCount || 0} uses
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(collection.updatedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/flow?collection=${collection.id}`}
            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
          >
            <GitBranch className="h-3 w-3" />
            View Flow
          </Link>
          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};