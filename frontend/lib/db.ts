/**
 * Frontend API client helper for communicating with the backend REST API
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BACKEND_API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

export async function fetchBackend(endpoint: string, options: RequestInit = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BACKEND_API_URL}${cleanEndpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response.json();
}
