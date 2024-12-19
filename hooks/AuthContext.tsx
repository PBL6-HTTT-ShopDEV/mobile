import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User, LoginPayload, UpdateProfilePayload } from '../types/User.types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log('AuthContext Mount');
    console.log('Initial user state:', user);
    console.log('Initial auth state:', isAuthenticated);
  }, []);

  const refreshUserData = async () => {
    console.log('Refreshing user data...');
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        console.log('Basic user data from storage:', parsedUser);
        
        // Lấy thông tin chi tiết của user
        try {
          const userProfileResponse = await authService.getUserProfile(parsedUser._id);
          console.log('Detailed user profile:', userProfileResponse);
          
          if (userProfileResponse.metadata) {
            const fullUserData = {
              ...parsedUser,
              ...userProfileResponse.metadata
            };
            
            await AsyncStorage.setItem('user', JSON.stringify(fullUserData));
            setUser(fullUserData);
            setIsAuthenticated(true);
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Fallback to basic user data
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } else {
        console.log('No user data or token found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  // Debug log when user state changes
  useEffect(() => {
    console.log('User state updated:', user);
    console.log('Auth state updated:', isAuthenticated);
  }, [user, isAuthenticated]);

  const updateProfile = async (data: UpdateProfilePayload) => {
    console.log('Updating profile with data:', data);
    try {
      if (!user?._id) {
        console.error('No user ID found');
        throw new Error('Không tìm thấy ID người dùng');
      }
      
      const response = await authService.updateProfile(user._id, data);
      console.log('Update profile response:', response);
      
      const updatedUser = { ...user, ...response.metadata };
      console.log('Updated user data:', updatedUser);
      
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const login = async (credentials: LoginPayload) => {
    console.log('Login attempt with:', credentials.email);
    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      if (response.metadata?.tokens?.accessToken) {
        await AsyncStorage.setItem('accessToken', response.metadata.tokens.accessToken);
        console.log('Access token stored');
      }

      if (response.metadata?.account) {
        const userData = response.metadata.account;
        console.log('Setting user data:', userData);
        
        try {
          // Lấy thông tin chi tiết của user sau khi login
          const userProfileResponse = await authService.getUserProfile(userData._id);
          console.log('User profile response:', userProfileResponse);
          
          if (userProfileResponse.metadata) {
            const fullUserData = {
              ...userData,
              ...userProfileResponse.metadata
            };
            
            await AsyncStorage.setItem('user', JSON.stringify(fullUserData));
            setUser(fullUserData);
            setIsAuthenticated(true);
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Fallback to basic account data if profile fetch fails
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    try {
      // Xóa token và user data từ AsyncStorage
      await AsyncStorage.multiRemove(['accessToken', 'user']);
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      updateProfile,
      refreshUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}