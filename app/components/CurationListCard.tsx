'use client';

import { CurationList } from '../types';
import { ChevronRight } from 'lucide-react';

interface CurationListCardProps {
  list: CurationList;
  restaurantCount?: number;
  onClick?: (list: CurationList) => void;
}

export function CurationListCard({ list, restaurantCount, onClick }: CurationListCardProps) {
  return (
    <div 
      className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer animate-fade-in"
      onClick={() => onClick?.(list)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {list.imageUrl ? (
            <img
              src={list.imageUrl}
              alt={list.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {list.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="heading text-text-primary">{list.name}</h3>
          <p className="body text-text-secondary mt-1 line-clamp-2">
            {list.description}
          </p>
          
          {restaurantCount !== undefined && (
            <p className="text-sm text-primary font-medium mt-2">
              {restaurantCount} {restaurantCount === 1 ? 'restaurant' : 'restaurants'}
            </p>
          )}
        </div>

        <ChevronRight className="text-text-secondary flex-shrink-0" size={20} />
      </div>
    </div>
  );
}
