import { ApiConfig } from '../types';

// Firebase configuration
export const apiConfig: ApiConfig = {
  baseUrl: 'https://identitytoolkit.googleapis.com/v1',
  apiKey: 'AIzaSyBldLwtsf16ZvKqLccELSaOUNzLQm2NIsE',
};

// Instructions for replacing the API key:
// 1. Get your Firebase API key from your Firebase Console
// 2. Replace the apiKey value with your actual Firebase API key
// 3. If you need to change the baseUrl as well, update that accordingly

export const updateApiKey = (newApiKey: string): void => {
  apiConfig.apiKey = newApiKey;
  console.log('API key updated successfully');
};