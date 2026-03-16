// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:44330';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/usuario/login',
  REGISTER: '/api/usuario/CreateAccount',
  
  // Transactions
  TRANSACTIONS: '/api/transacoes',
  TRANSACTION: (id: number) => `/api/transacoes/${id}`,
  
  // Categories
  CATEGORIES: '/api/categoria',
  CATEGORY: (id: number) => `/api/categoria/${id}`,
  
  // People
  PEOPLE: '/api/pessoas',
  PERSON: (id: number) => `/api/pessoas/${id}`,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'granaflow_token',
  USER: 'granaflow_user',
};

// App Constants
export const APP_NAME = 'GranaFlow';
export const CURRENCY = 'BRL';
export const DATE_FORMAT = 'dd/MM/yyyy';
