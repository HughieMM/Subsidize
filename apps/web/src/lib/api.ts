import { createApiClient } from '@subsidize/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const apiClient = createApiClient(API_URL);
