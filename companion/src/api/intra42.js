import { CLIENT_ID, CLIENT_SECRET, API_URL } from '@env';
import axios from 'axios';

let token = null;
let tokenExpiry = null;

console.log('🔧 [API] Environment check:', { 
  CLIENT_ID: CLIENT_ID ? 'set' : 'undefined', 
  CLIENT_SECRET: CLIENT_SECRET ? 'set' : 'undefined',
  API_URL 
});

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, type, statusCode = null) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

// Error types for easier handling
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  TOKEN_ERROR: 'TOKEN_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Check if token is expired
function isTokenExpired() {
  if (!token || !tokenExpiry) return true;
  return Date.now() >= tokenExpiry;
}

// Clear token (useful for retry logic)
export function clearToken() {
  token = null;
  tokenExpiry = null;
  console.log('🔄 [API] Token cleared');
}

export async function getAccessToken() {
  if (token && !isTokenExpired()) {
    console.log('🔑 [API] Using cached access token');
    return token;
  }

  console.log('📡 [API] Requesting new access token');
  
  // Check if credentials are configured
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new ApiError(
      'API credentials are not configured. Please check your .env file.',
      ErrorTypes.INVALID_CREDENTIALS
    );
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const resp = await axios.post('https://api.intra.42.fr/oauth/token', params, {
      timeout: 10000, // 10 second timeout
    });
    token = resp.data.access_token;
    // Set token expiry (42 API tokens typically last 2 hours, we'll refresh at 1h 50min)
    tokenExpiry = Date.now() + (resp.data.expires_in ? (resp.data.expires_in - 600) * 1000 : 6600000);
    console.log('✅ [API] Access token obtained');
    return token;
  } catch (err) {
    console.error('❌ [API] Failed to obtain access token:', err.response?.status, err.message);
    
    // Handle network errors
    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        throw new ApiError(
          'Connection timed out. Please check your internet connection.',
          ErrorTypes.NETWORK_ERROR
        );
      }
      throw new ApiError(
        'Network error. Please check your internet connection.',
        ErrorTypes.NETWORK_ERROR
      );
    }
    
    // Handle HTTP errors
    const status = err.response.status;
    
    if (status === 401) {
      throw new ApiError(
        'Invalid API credentials. Please check your CLIENT_ID and CLIENT_SECRET.',
        ErrorTypes.INVALID_CREDENTIALS,
        status
      );
    }
    
    if (status === 429) {
      throw new ApiError(
        'Too many requests. Please wait a moment and try again.',
        ErrorTypes.RATE_LIMITED,
        status
      );
    }
    
    if (status >= 500) {
      throw new ApiError(
        '42 API server is temporarily unavailable. Please try again later.',
        ErrorTypes.SERVER_ERROR,
        status
      );
    }
    
    throw new ApiError(
      'Failed to authenticate with 42 API.',
      ErrorTypes.TOKEN_ERROR,
      status
    );
  }
}

export async function getUser(login, retryCount = 0) {
  console.log(`📡 [API] Fetching user: ${login}`);
  
  // Validate login input
  const trimmedLogin = login.trim().toLowerCase();
  if (!trimmedLogin) {
    throw new ApiError(
      'Please enter a valid login.',
      ErrorTypes.USER_NOT_FOUND
    );
  }
  
  // Basic login format validation (alphanumeric, hyphens, max 20 chars)
  if (!/^[a-z0-9-]{1,20}$/.test(trimmedLogin)) {
    throw new ApiError(
      'Invalid login format. Use only letters, numbers, and hyphens.',
      ErrorTypes.USER_NOT_FOUND
    );
  }

  try {
    const t = await getAccessToken();
    const resp = await axios.get(`${API_URL}/users/${trimmedLogin}`, {
      headers: { Authorization: `Bearer ${t}` },
      timeout: 15000, // 15 second timeout
    });
    console.log(`✅ [API] User data received for: ${trimmedLogin}`);
    return resp.data;
  } catch (err) {
    // Re-throw ApiErrors from getAccessToken
    if (err instanceof ApiError) {
      throw err;
    }
    
    console.error(`❌ [API] Failed to fetch user ${trimmedLogin}:`, err.response?.status, err.message);
    
    // Handle network errors
    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        throw new ApiError(
          'Request timed out. Please check your internet connection.',
          ErrorTypes.NETWORK_ERROR
        );
      }
      throw new ApiError(
        'Network error. Please check your internet connection.',
        ErrorTypes.NETWORK_ERROR
      );
    }
    
    // Handle HTTP errors
    const status = err.response.status;
    
    if (status === 404) {
      throw new ApiError(
        `User "${trimmedLogin}" not found. Please check the login and try again.`,
        ErrorTypes.USER_NOT_FOUND,
        status
      );
    }
    
    if (status === 401) {
      // Token might be invalid, clear it and retry once
      if (retryCount < 1) {
        console.log('🔄 [API] Token invalid, clearing and retrying...');
        clearToken();
        return getUser(login, retryCount + 1);
      }
      throw new ApiError(
        'Authentication failed. Please try again.',
        ErrorTypes.TOKEN_ERROR,
        status
      );
    }
    
    if (status === 429) {
      throw new ApiError(
        'Too many requests. Please wait a moment and try again.',
        ErrorTypes.RATE_LIMITED,
        status
      );
    }
    
    if (status >= 500) {
      throw new ApiError(
        '42 API server is temporarily unavailable. Please try again later.',
        ErrorTypes.SERVER_ERROR,
        status
      );
    }
    
    throw new ApiError(
      'An unexpected error occurred. Please try again.',
      ErrorTypes.UNKNOWN_ERROR,
      status
    );
  }
}
