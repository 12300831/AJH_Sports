// Centralized API configuration and utilities
// Version: 2026-01-14 - Production detection fix

const getApiUrl = (): string => {
  // First check environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '' && !envUrl.includes('localhost')) {
    console.log('🌐 [ENV VAR] Using API URL from environment:', envUrl);
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  
  // AGGRESSIVE PRODUCTION DETECTION
  // Default to production UNLESS we're 100% certain we're on localhost
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname.toLowerCase();
    const origin = window.location.origin.toLowerCase();
    const href = window.location.href.toLowerCase();
    
    // ONLY use localhost if ALL conditions are met:
    // 1. hostname is EXACTLY 'localhost' or '127.0.0.1'
    // 2. origin contains 'localhost' or '127.0.0.1'
    // 3. href contains 'localhost' or '127.0.0.1'
    // 4. NOT on any Firebase domain
    // 5. NOT on any other domain
    const isLocalhost = 
      (hostname === 'localhost' || hostname === '127.0.0.1') &&
      (origin.includes('localhost') || origin.includes('127.0.0.1')) &&
      (href.includes('localhost') || href.includes('127.0.0.1')) &&
      !hostname.includes('web.app') &&
      !hostname.includes('firebase') &&
      !hostname.includes('azure') &&
      !hostname.includes('.');
    
    if (isLocalhost) {
      console.log('🏠 [LOCALHOST DETECTED] Hostname:', hostname, '| Using local API');
      return 'http://localhost:5001/api';
    }
    
    // EVERYTHING ELSE uses production (Firebase, Azure, any domain, etc.)
    console.log('🌐 [PRODUCTION] Hostname:', hostname, '| Origin:', origin, '| Using production API');
    return 'https://ajh-sports-backend.azurewebsites.net/api';
  }
  
  // Fallback: ALWAYS default to production (safer than localhost)
  console.log('🌐 [FALLBACK] Using production API (no window object)');
  return 'https://ajh-sports-backend.azurewebsites.net/api';
};

// Get API URL dynamically at runtime (not at module load time)
export const getAPI_URL = () => getApiUrl();

// Helper function to make authenticated API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${getAPI_URL()}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

// Get base URL (without /api)
export const getBaseUrl = (): string => {
  const apiUrl = getAPI_URL();
  return apiUrl.replace('/api', '') || 'https://ajh-sports-backend.azurewebsites.net';
};

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

