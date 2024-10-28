import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AuthContextType, AuthState, IUser, LoginPayload } from '../types/User.types';
import { authService } from '../services/authService';

// Constants for storage keys to avoid typos
const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken'
} as const;

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [storedUser, storedToken, storedRefreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setState({
          user: parsedUser,
          token: storedToken,
          refreshToken: storedRefreshToken,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  async function storeAuthData(user: Omit<IUser, 'password'>, token: string, refreshToken: string) {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  }

  async function clearAuthData() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN
    ]);
  }

  async function login(credentials: LoginPayload) {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await authService.login(credentials);
      
      await storeAuthData(response.user, response.token, response.refreshToken);

      setState({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        loading: false,
        isAuthenticated: true,
      });

      router.replace('/(tabs)/home');
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }

  async function logout() {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      if (state.token) {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Error during API logout:', error);
          // Continue with local logout even if API fails
        }
      }

      await clearAuthData();
      
      setState(initialState);
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }

  async function updateUser(userData: Partial<Omit<IUser, 'password'>>) {
    try {
      if (!state.token || !state.user) {
        throw new Error('Not authenticated');
      }

      setState(prev => ({ ...prev, loading: true }));
      
      const updatedUser = await authService.updateUser(state.token, userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }

  

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    socialLogin: async () => {
      throw new Error('Not implemented');
    },
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}