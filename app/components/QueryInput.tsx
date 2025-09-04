'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface QueryInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function QueryInput({ onSearch, isLoading = false, placeholder = "What are you craving? (e.g., cozy Italian, quick sushi)" }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const quickOptions = [
    'Cozy Italian dinner',
    'Quick healthy lunch',
    'Fun brunch spot',
    'Romantic date night',
    'Comfort food vibes',
    'Fresh sushi'
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input pl-10 pr-12"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-1 px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Go'
            )}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <p className="text-sm text-text-secondary font-medium">Quick options:</p>
        <div className="flex flex-wrap gap-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              onClick={() => setQuery(option)}
              className="tag-secondary hover:bg-gray-200 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
