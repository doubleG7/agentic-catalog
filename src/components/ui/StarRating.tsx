import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  showValue?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  readOnly = false,
  showValue = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleStarClick = (starRating: number) => {
    if (!readOnly && onRatingChange) {
      // Allow half-star ratings by checking click position
      const newRating = starRating;
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readOnly) {
      setHoverRating(starRating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoverRating(0);
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = isHovering ? hoverRating : rating;
    
    // For star 1: needs rating >= 1 for full, >= 0.5 for half
    // For star 2: needs rating >= 2 for full, >= 1.5 for half  
    // For star 3: needs rating >= 3 for full, >= 2.5 for half
    // For star 4: needs rating >= 4 for full, >= 3.5 for half
    // For star 5: needs rating >= 5 for full, >= 4.5 for half
    
    if (currentRating >= starIndex) {
      return 'fill-yellow-400 text-yellow-400';
    } else if (currentRating >= starIndex - 0.5) {
      return 'fill-yellow-400/50 text-yellow-400';
    } else {
      return 'fill-none text-gray-300 dark:text-gray-600';
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className="flex items-center space-x-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            type="button"
            disabled={readOnly}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded`}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            onMouseMove={(e) => {
              if (!readOnly) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const halfStar = x < width / 2;
                const newRating = halfStar ? starIndex - 0.5 : starIndex;
                setHoverRating(Math.min(5, Math.max(0, newRating))); // Ensure rating stays within 0-5 range
              }
            }}
            aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
          >
            <Star 
              className={`${sizeClasses[size]} ${getStarFill(starIndex)} transition-colors duration-150`}
            />
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 min-w-[2rem]">
          {rating > 0 ? rating.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
};