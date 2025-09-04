import { Restaurant } from '../types';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

export async function searchRestaurants(location: string, query?: string): Promise<Restaurant[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('Apify API token not configured, returning mock data');
    return getMockRestaurants();
  }

  try {
    const input = {
      searchQuery: query || 'restaurants',
      location: location,
      maxResults: 20,
    };

    const response = await fetch(`https://api.apify.com/v2/acts/cleansyntax~restaurant-finder-usa/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_TOKEN}`,
      },
      body: JSON.stringify({
        input,
        build: 'latest',
      }),
    });

    if (!response.ok) {
      throw new Error('Apify API request failed');
    }

    const runData = await response.json();
    const runId = runData.data.id;

    // Wait for the run to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get the results
    const resultsResponse = await fetch(`https://api.apify.com/v2/acts/cleansyntax~restaurant-finder-usa/runs/${runId}/dataset/items`, {
      headers: {
        'Authorization': `Bearer ${APIFY_API_TOKEN}`,
      },
    });

    if (!resultsResponse.ok) {
      throw new Error('Failed to fetch Apify results');
    }

    const results = await resultsResponse.json();
    
    return results.map((item: any, index: number) => ({
      id: `apify-${index}`,
      name: item.name || 'Unknown Restaurant',
      address: item.address || 'Address not available',
      cuisine: item.cuisine || 'Various',
      vibe: item.atmosphere || 'Casual',
      priceRange: item.priceRange || 'mid-range',
      rating: item.rating || 4.0,
      imageUrl: item.imageUrl || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop`,
      openHours: item.hours || 'Hours vary',
      description: item.description,
    }));
  } catch (error) {
    console.error('Error fetching from Apify:', error);
    return getMockRestaurants();
  }
}

function getMockRestaurants(): Restaurant[] {
  return [
    {
      id: 'mock-1',
      name: 'The Cozy Corner',
      address: '123 Main St, Your City',
      cuisine: 'Italian',
      vibe: 'Cozy',
      priceRange: 'mid-range',
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      openHours: '5:00 PM - 10:00 PM',
      description: 'Intimate Italian bistro with handmade pasta and warm ambiance.',
    },
    {
      id: 'mock-2',
      name: 'Sunrise Cafe',
      address: '456 Oak Ave, Your City',
      cuisine: 'American',
      vibe: 'Bright',
      priceRange: 'budget',
      rating: 4.2,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      openHours: '7:00 AM - 3:00 PM',
      description: 'Cheerful breakfast spot with fresh ingredients and friendly service.',
    },
    {
      id: 'mock-3',
      name: 'Zen Garden',
      address: '789 Pine St, Your City',
      cuisine: 'Asian',
      vibe: 'Peaceful',
      priceRange: 'mid-range',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=300&fit=crop',
      openHours: '12:00 PM - 9:00 PM',
      description: 'Tranquil Asian fusion with beautiful garden seating.',
    },
    {
      id: 'mock-4',
      name: 'The Lively Pub',
      address: '321 Beer St, Your City',
      cuisine: 'Pub Food',
      vibe: 'Energetic',
      priceRange: 'budget',
      rating: 4.0,
      imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&h=300&fit=crop',
      openHours: '4:00 PM - 12:00 AM',
      description: 'Vibrant sports bar with craft beers and hearty comfort food.',
    },
    {
      id: 'mock-5',
      name: 'Fine Dining Experience',
      address: '555 Luxury Blvd, Your City',
      cuisine: 'French',
      vibe: 'Elegant',
      priceRange: 'upscale',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      openHours: '6:00 PM - 11:00 PM',
      description: 'Sophisticated French cuisine in an upscale setting.',
    },
    {
      id: 'mock-6',
      name: 'Taco Fiesta',
      address: '777 Spice Ave, Your City',
      cuisine: 'Mexican',
      vibe: 'Fun',
      priceRange: 'budget',
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      openHours: '11:00 AM - 10:00 PM',
      description: 'Colorful Mexican cantina with authentic flavors and festive atmosphere.',
    },
  ];
}
