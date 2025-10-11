import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from './Button';

interface RatingInputProps {
  currentRating?: number;
  onRatingSubmit: (rating: number) => void;
  onCancel?: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  currentRating = 0,
  onRatingSubmit,
  onCancel,
  title = 'Rate this item',
  size = 'lg',
  className = '',
}) => {
  const [selectedRating, setSelectedRating] = useState(currentRating);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onRatingSubmit(selectedRating);
    }
  };

  const handleCancel = () => {
    setSelectedRating(currentRating);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h3>
      
      <div className="flex flex-col space-y-4">
        <StarRating
          rating={selectedRating}
          onRatingChange={setSelectedRating}
          size={size}
          showValue
          className="justify-center"
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={selectedRating === 0}
          >
            {currentRating > 0 ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </div>
      </div>
    </div>
  );
};