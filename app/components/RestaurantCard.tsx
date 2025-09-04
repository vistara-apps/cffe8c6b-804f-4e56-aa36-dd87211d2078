'use client';

import { Restaurant } from '../types';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { useState } from 'react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: 'default' | 'compact';
  isSaved?: boolean;
  onSave?: (restaurant: Restaurant) => void;
  onUnsave?: (restaurant: Restaurant) => void;
  matchReason?: string;
  enhancedDescription?: string;
}

export function RestaurantCard({ 
  restaurant, 
  variant = 'default', 
  isSaved = false,
  onSave,
  onUnsave,
  matchReason,
  enhancedDescription
}: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      onUnsave?.(restaurant);
    } else {
      onSave?.(restaurant);
    }
  };

  const getPriceSymbol = (priceRange: string) => {
    switch (priceRange.toLowerCase()) {
      case 'budget': return '$';
      case 'mid-range': return '$$';
      case 'upscale': return '$$$';
      default: return '$$';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="card hover:shadow-lg transition-shadow duration-200 animate-fade-in">
        <div className="flex space-x-3">
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            {!imageError ? (
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-text-primary truncate">{restaurant.name}</h3>
              <button
                onClick={handleSaveClick}
                className="text-text-secondary hover:text-red-500 transition-colors flex-shrink-0 ml-2"
              >
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className="tag-primary text-xs">{restaurant.cuisine}</span>
              <span className="text-accent font-semibold text-sm">{getPriceSymbol(restaurant.priceRange)}</span>
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              <Star size={12} className="text-accent fill-current" />
              <span className="text-sm text-text-secondary">{restaurant.rating}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200 animate-slide-up">
      <div className="relative">
        <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
          {!imageError ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 text-text-secondary hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="heading text-text-primary">{restaurant.name}</h3>
          
          {matchReason && (
            <p className="text-sm text-primary font-medium mt-1">
              ✨ {matchReason}
            </p>
          )}
          
          <p className="body text-text-secondary mt-1">
            {enhancedDescription || restaurant.description || 'A great dining experience awaits.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <span className="tag-primary">{restaurant.cuisine}</span>
          <span className="tag-secondary">{restaurant.vibe}</span>
          <span className="text-accent font-bold">{getPriceSymbol(restaurant.priceRange)}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-accent fill-current" />
            <span>{restaurant.rating}</span>
          </div>
          
          {restaurant.distance && (
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{restaurant.distance}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 text-sm text-text-secondary">
          <Clock size={14} />
          <span>{restaurant.openHours}</span>
        </div>

        <div className="flex items-center space-x-1 text-sm text-text-secondary">
          <MapPin size={14} />
          <span className="truncate">{restaurant.address}</span>
        </div>
      </div>
    </div>
  );
}
