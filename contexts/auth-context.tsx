'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginRequest, RegisterRequest } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/constants';

interface AuthContextType {
  nameUser: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isTokenValid(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function obterNomeUsuario(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.Nome;
  } catch {
    return "";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nameUser, setNameUser] = useState("");

  // Restaurar usuário do localStorage ao carregar
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
      setNameUser(obterNomeUsuario(token))
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      setIsAuthenticated(false);
      setNameUser("")
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);

      if (response != null) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

        setIsAuthenticated(true);
        setNameUser(obterNomeUsuario(response.token));
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<boolean>(API_ENDPOINTS.REGISTER, data);

      return response;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  return (
    <AuthContext.Provider
      value={{
        nameUser,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
