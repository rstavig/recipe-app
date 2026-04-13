// Use an environment variable for the API base URL, fallback to localhost for development
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Build all endpoints from the base URL
export const API_URL = API_BASE_URL; // General API base
export const API_MY_RECIPES_URL = `${API_BASE_URL}/api/recipes/mine`;
export const API_RECIPE_URL = `${API_BASE_URL}/api/recipes`;
export const API_FAVORITES_URL = `${API_BASE_URL}/api/favorites`;
