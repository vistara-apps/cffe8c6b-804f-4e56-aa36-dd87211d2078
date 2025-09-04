export interface User {
  userId: string;
  farcasterId?: string;
  preferences?: Record<string, any>;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  vibe: string;
  priceRange: string;
  rating: number;
  imageUrl: string;
  openHours: string;
  description?: string;
  distance?: string;
}

export interface SavedRestaurant {
  userId: string;
  restaurantId: string;
  savedAt: Date;
}

export interface CurationList {
  id: string;
  name: string;
  description: string;
  restaurants: string[];
  imageUrl?: string;
}

export interface SearchQuery {
  craving: string;
  vibe: string;
  priceRange: string;
  location?: string;
}
