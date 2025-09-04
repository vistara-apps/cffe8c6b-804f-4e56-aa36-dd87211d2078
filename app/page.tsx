'use client';

import { useState } from 'react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Identity, Name, Avatar } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { Search, MapPin, Clock, Star, DollarSign, Heart, Filter } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  vibe: string;
  priceRange: string;
  rating: number;
  imageUrl: string;
  address: string;
  openHours: string;
  distance?: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Cozy Corner Bistro',
    cuisine: 'French',
    vibe: 'intimate',
    priceRange: '$$',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    address: '123 Main St, Brooklyn, NY',
    openHours: 'Open until 10 PM',
    distance: '0.3 miles'
  },
  {
    id: '2',
    name: 'Noodle House Express',
    cuisine: 'Asian',
    vibe: 'casual',
    priceRange: '$',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    address: '456 Oak Ave, Brooklyn, NY',
    openHours: 'Open until 11 PM',
    distance: '0.5 miles'
  },
  {
    id: '3',
    name: 'Garden Terrace',
    cuisine: 'Mediterranean',
    vibe: 'upscale',
    priceRange: '$$$',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    address: '789 Park Blvd, Brooklyn, NY',
    openHours: 'Open until 12 AM',
    distance: '0.8 miles'
  }
];

const curatedLists = [
  {
    id: '1',
    name: 'Hidden Gems in Brooklyn',
    description: 'Discover unique local spots you won\'t find on mainstream apps',
    restaurantCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Best Late Night Eats',
    description: 'Perfect spots for when hunger strikes after midnight',
    restaurantCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=200&fit=crop'
  }
];

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="card p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex gap-4">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{restaurant.name}</h3>
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`p-1 rounded-full transition-colors ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="tag-primary">{restaurant.cuisine}</span>
            <span className="tag-secondary">{restaurant.vibe}</span>
            <span className="tag-secondary">{restaurant.priceRange}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.openHours}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurationListCard({ list }: { list: typeof curatedLists[0] }) {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <img 
        src={list.imageUrl} 
        alt={list.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{list.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{list.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{list.restaurantCount} restaurants</span>
          <span className="text-sm font-medium text-blue-600">Explore →</span>
        </div>
      </div>
    </div>
  );
}

function QueryInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I'm craving Italian, cozy vibe, mid-price..."
          className="input w-full pl-10 pr-4 py-3 text-base"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-4 py-1.5 text-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'discover' | 'lists'>('discover');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would call OpenAI API and Apify Restaurant Finder
      setRestaurants(mockRestaurants.filter(r => 
        r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        r.vibe.toLowerCase().includes(query.toLowerCase()) ||
        r.name.toLowerCase().includes(query.toLowerCase())
      ));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CraveLocal</h1>
              <p className="text-sm text-gray-600">Discover your next favorite local restaurant</p>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wallet>
                  <Identity address={address} className="flex items-center gap-2">
                    <Avatar className="w-8 h-8" />
                    <Name className="text-sm font-medium" />
                  </Identity>
                </Wallet>
              ) : (
                <ConnectWallet className="btn-primary text-sm px-3 py-2" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container max-w-md mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'discover'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'lists'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Curated Lists
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-md mx-auto py-6">
        {activeTab === 'discover' ? (
          <div>
            <QueryInput onSearch={handleSearch} />
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Finding perfect matches...</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Restaurants near you ({restaurants.length})
                  </h2>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                
                {restaurants.length > 0 ? (
                  <div>
                    {restaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No restaurants found. Try a different search!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Curated Lists</h2>
              <p className="text-sm text-gray-600">Discover unique dining experiences</p>
            </div>
            
            <div className="space-y-4">
              {curatedLists.map((list) => (
                <CurationListCard key={list.id} list={list} />
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Premium Lists Available</h3>
              <p className="text-sm text-blue-700 mb-3">
                Unlock exclusive curated lists with insider recommendations for just $0.25 per list.
              </p>
              <button className="btn-primary text-sm">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Explore Premium
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
