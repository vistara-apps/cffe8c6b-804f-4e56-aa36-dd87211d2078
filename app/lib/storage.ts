import { Restaurant, SavedRestaurant, CurationList } from '../types';

// Simple in-memory storage for MVP
// In production, this would use Upstash Redis or a database
let savedRestaurants: SavedRestaurant[] = [];
let curationLists: CurationList[] = [
  {
    id: 'hidden-gems',
    name: 'Hidden Gems',
    description: 'Unique local spots you won\'t find on the main apps',
    restaurants: ['mock-3', 'mock-1'],
    imageUrl: 'https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=400&h=300&fit=crop',
  },
  {
    id: 'date-night',
    name: 'Perfect Date Spots',
    description: 'Romantic restaurants for special evenings',
    restaurants: ['mock-5', 'mock-1'],
    imageUrl: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=400&h=300&fit=crop',
  },
  {
    id: 'quick-bites',
    name: 'Quick & Delicious',
    description: 'Fast, affordable options that don\'t compromise on taste',
    restaurants: ['mock-2', 'mock-6'],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
  },
];

export function saveRestaurant(userId: string, restaurantId: string): void {
  const existing = savedRestaurants.find(
    sr => sr.userId === userId && sr.restaurantId === restaurantId
  );
  
  if (!existing) {
    savedRestaurants.push({
      userId,
      restaurantId,
      savedAt: new Date(),
    });
  }
}

export function removeSavedRestaurant(userId: string, restaurantId: string): void {
  savedRestaurants = savedRestaurants.filter(
    sr => !(sr.userId === userId && sr.restaurantId === restaurantId)
  );
}

export function getSavedRestaurants(userId: string): SavedRestaurant[] {
  return savedRestaurants.filter(sr => sr.userId === userId);
}

export function isRestaurantSaved(userId: string, restaurantId: string): boolean {
  return savedRestaurants.some(
    sr => sr.userId === userId && sr.restaurantId === restaurantId
  );
}

export function getCurationLists(): CurationList[] {
  return curationLists;
}

export function getCurationList(id: string): CurationList | undefined {
  return curationLists.find(list => list.id === id);
}
