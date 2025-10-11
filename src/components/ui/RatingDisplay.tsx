import React from 'react';
import { StarRating } from './StarRating';

interface RatingDisplayProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showCount?: boolean;
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalRatings,
  size = 'md',
  showValue = true,
  showCount = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <StarRating
        rating={rating}
        size={size}
        readOnly
        showValue={showValue}
      />
      
      {showCount && totalRatings !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};