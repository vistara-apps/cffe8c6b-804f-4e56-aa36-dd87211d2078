import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export interface ParsedQuery {
  cuisine: string[];
  vibe: string[];
  priceRange: string;
  searchTerms: string[];
}

export async function parseRestaurantQuery(query: string): Promise<ParsedQuery> {
  try {
    const prompt = `
    Parse this restaurant search query and extract structured information:
    Query: "${query}"
    
    Return a JSON object with:
    - cuisine: Array of cuisine types (e.g., ["italian", "asian", "american"])
    - vibe: Array of atmosphere descriptors (e.g., ["cozy", "lively", "quiet", "romantic"])
    - priceRange: One of "budget", "mid-range", "upscale", or "any"
    - searchTerms: Array of key search terms for restaurant matching
    
    Example output:
    {
      "cuisine": ["italian"],
      "vibe": ["cozy", "romantic"],
      "priceRange": "mid-range",
      "searchTerms": ["pasta", "wine", "intimate"]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a restaurant search assistant. Parse user queries into structured data for restaurant matching. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing restaurant query:', error);
    // Fallback parsing
    return {
      cuisine: [],
      vibe: [],
      priceRange: "any",
      searchTerms: [query]
    };
  }
}

export async function generateRestaurantRecommendations(restaurants: any[], query: string): Promise<any[]> {
  try {
    const prompt = `
    Given this user query: "${query}"
    And these restaurant options: ${JSON.stringify(restaurants.slice(0, 10))}
    
    Rank and filter the restaurants based on how well they match the user's mood and preferences. 
    Return the top 6 restaurants with enhanced descriptions that highlight why they match the query.
    
    For each restaurant, include:
    - All original data
    - relevanceScore (1-10)
    - matchReason: Brief explanation of why it matches
    - enhancedDescription: 1-2 sentences describing the atmosphere and food
    
    Return as JSON array.
    `;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a restaurant recommendation expert. Analyze restaurants and match them to user preferences with detailed explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      return restaurants.slice(0, 6);
    }

    return JSON.parse(result);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return restaurants.slice(0, 6);
  }
}
