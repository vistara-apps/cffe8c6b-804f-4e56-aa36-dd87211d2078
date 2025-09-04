'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { QueryInput } from './components/QueryInput';
import { RestaurantCard } from './components/RestaurantCard';
import { CurationListCard } from './components/CurationListCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Restaurant, CurationList } from './types';
import { parseRestaurantQuery, generateRestaurantRecommendations } from './lib/openai';
import { searchRestaurants } from './lib/apify';
import { 
  saveRestaurant, 
  removeSavedRestaurant, 
  getSavedRestaurants, 
  isRestaurantSaved,
  getCurationLists,
  getCurationList
} from './lib/storage';
import { Utensils, ArrowLeft } from 'lucide-react';

type TabType = 'home' | 'lists' | 'saved';
type ViewType = 'search' | 'results' | 'list-detail';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentView, setCurrentView] = useState<ViewType>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [curationLists] = useState<CurationList[]>(getCurationLists());
  const [selectedList, setSelectedList] = useState<CurationList | null>(null);
  const [listRestaurants, setListRestaurants] = useState<Restaurant[]>([]);

  // Mock user ID for demo
  const userId = 'demo-user';

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setLastQuery(query);
    
    try {
      // Parse the query with OpenAI
      const parsedQuery = await parseRestaurantQuery(query);
      console.log('Parsed query:', parsedQuery);
      
      // Search restaurants with Apify (using mock data for demo)
      const searchResults = await searchRestaurants('New York, NY', query);
      
      // Get AI recommendations
      const recommendations = await generateRestaurantRecommendations(searchResults, query);
      
      setRestaurants(recommendations);
      setCurrentView('results');
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      const mockResults = await searchRestaurants('New York, NY', query);
      setRestaurants(mockResults);
      setCurrentView('results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRestaurant = (restaurant: Restaurant) => {
    saveRestaurant(userId, restaurant.id);
  };

  const handleUnsaveRestaurant = (restaurant: Restaurant) => {
    removeSavedRestaurant(userId, restaurant.id);
  };

  const getSavedRestaurantsList = (): Restaurant[] => {
    const saved = getSavedRestaurants(userId);
    return restaurants.filter(r => saved.some(s => s.restaurantId === r.id));
  };

  const handleListClick = async (list: CurationList) => {
    setSelectedList(list);
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch restaurants by IDs
      // For demo, we'll show some relevant restaurants
      const mockResults = await searchRestaurants('New York, NY');
      const filteredResults = mockResults.filter(r => 
        list.restaurants.includes(r.id)
      );
      
      setListRestaurants(filteredResults.length > 0 ? filteredResults : mockResults.slice(0, 3));
      setCurrentView('list-detail');
    } catch (error) {
      console.error('Error loading list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentView('search');
    }
  };

  const renderSearchView = () => (
    <div className="container max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="text-white" size={24} />
        </div>
        <h2 className="display text-text-primary">What are you craving?</h2>
        <p className="body text-text-secondary">
          Tell us your mood, cuisine preference, or vibe and we'll find the perfect local spot for you.
        </p>
      </div>

      <QueryInput onSearch={handleSearch} isLoading={isLoading} />

      <div className="space-y-4">
        <h3 className="heading text-text-primary">Popular Right Now</h3>
        <div className="grid gap-3">
          {curationLists.slice(0, 2).map((list) => (
            <CurationListCard
              key={list.id}
              list={list}
              restaurantCount={list.restaurants.length}
              onClick={handleListClick}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderResultsView = () => (
    <div className="container max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading text-text-primary">Results for "{lastQuery}"</h2>
          <p className="text-sm text-text-secondary">{restaurants.length} restaurants found</p>
        </div>
        <button
          onClick={() => setCurrentView('search')}
          className="btn-secondary text-sm"
        >
          New Search
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isSaved={isRestaurantSaved(userId, restaurant.id)}
              onSave={handleSaveRestaurant}
              onUnsave={handleUnsaveRestaurant}
              matchReason={(restaurant as any).matchReason}
              enhancedDescription={(restaurant as any).enhancedDescription}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderListsView = () => (
    <div className="container max-w-md mx-auto space-y-4">
      <div>
        <h2 className="display text-text-primary">Curated Lists</h2>
        <p className="body text-text-secondary">
          Discover handpicked collections of exceptional restaurants
        </p>
      </div>

      <div className="grid gap-3">
        {curationLists.map((list) => (
          <CurationListCard
            key={list.id}
            list={list}
            restaurantCount={list.restaurants.length}
            onClick={handleListClick}
          />
        ))}
      </div>
    </div>
  );

  const renderListDetailView = () => (
    <div className="container max-w-md mx-auto space-y-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCurrentView('search')}
          className="text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="heading text-text-primary">{selectedList?.name}</h2>
          <p className="text-sm text-text-secondary">{selectedList?.description}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <div className="grid gap-4">
          {listRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isSaved={isRestaurantSaved(userId, restaurant.id)}
              onSave={handleSaveRestaurant}
              onUnsave={handleUnsaveRestaurant}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderSavedView = () => {
    const savedRestaurants = getSavedRestaurantsList();
    
    return (
      <div className="container max-w-md mx-auto space-y-4">
        <div>
          <h2 className="display text-text-primary">Saved Restaurants</h2>
          <p className="body text-text-secondary">
            Your favorite spots and places to try
          </p>
        </div>

        {savedRestaurants.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Utensils className="text-gray-400" size={24} />
            </div>
            <p className="text-text-secondary">No saved restaurants yet</p>
            <button
              onClick={() => setActiveTab('home')}
              className="btn-primary"
            >
              Discover Restaurants
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {savedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                variant="compact"
                isSaved={true}
                onUnsave={handleUnsaveRestaurant}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'lists') {
      return currentView === 'list-detail' ? renderListDetailView() : renderListsView();
    }
    
    if (activeTab === 'saved') {
      return renderSavedView();
    }

    // Home tab
    if (currentView === 'results') {
      return renderResultsView();
    }
    
    return renderSearchView();
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="py-6">
        {renderContent()}
      </div>
    </AppShell>
  );
}
