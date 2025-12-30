import { createApiClient } from '@subsidize/shared';
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const USE_MOCKS =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_USE_MOCKS === 'true';

export const apiClient = createApiClient(API_URL);
