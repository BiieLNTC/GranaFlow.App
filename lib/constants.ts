// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:44330';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/usuario/Login',
  REGISTER: '/api/usuario/CreateAccount',
  
  // Transactions
  TRANSACTIONS: '/api/transacao',
  ObterTotaisTransacoes: '/api/transacao/ObterTotaisTransacoes',
  ObterTotaisPessoas: '/api/transacao/ObterTotaisPessoas',
  TRANSACTION: (id: number) => `/api/transacao/${id}`,
  
  // Categories
  CATEGORIES: '/api/categoria',
  CATEGORY: (id: number) => `/api/categoria/${id}`,
  
  // People
  PEOPLE: '/api/pessoa',
  PERSON: (id: number) => `/api/pessoa/${id}`,
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
