/**
 * Centralized API configuration.
 * When running locally (npm run dev), it defaults to localhost:5000.
 * In production, you can set VITE_API_URL in your Vercel environment variables.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
