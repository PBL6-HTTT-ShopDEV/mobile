import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ITour } from '../types/Tour.types';
import { useAuth } from './AuthContext';

interface FavoriteTourContextProps {
  favoriteTours: ITour[];
  toggleFavoriteTour: (tour: ITour) => void;
}

const FavoriteTourContext = createContext<FavoriteTourContextProps | undefined>(undefined);

export const FavoriteTourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteTours, setFavoriteTours] = useState<ITour[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      loadFavoriteTours(user._id);
    } else {
      setFavoriteTours([]);
    }
  }, [user]);

  const loadFavoriteTours = async (userId: string) => {
    try {
      const savedTours = await AsyncStorage.getItem(`favoriteTours_${userId}`);
      if (savedTours) {
        setFavoriteTours(JSON.parse(savedTours));
      }
    } catch (error) {
      console.error('Error loading favorite tours:', error);
    }
  };

  const toggleFavoriteTour = async (tour: ITour) => {
    if (!user?._id) {
      console.error('No user logged in');
      return;
    }

    try {
      const newFavoriteTours = favoriteTours.some((t) => t._id === tour._id)
        ? favoriteTours.filter((t) => t._id !== tour._id)
        : [...favoriteTours, tour];

      setFavoriteTours(newFavoriteTours);
      await AsyncStorage.setItem(`favoriteTours_${user._id}`, JSON.stringify(newFavoriteTours));
    } catch (error) {
      console.error('Error saving favorite tour:', error);
    }
  };

  return (
    <FavoriteTourContext.Provider value={{ favoriteTours, toggleFavoriteTour }}>
      {children}
    </FavoriteTourContext.Provider>
  );
};

export const useFavoriteTour = () => {
  const context = React.useContext(FavoriteTourContext);
  if (!context) {
    throw new Error('useFavoriteTour must be used within a FavoriteTourProvider');
  }
  return context;
};
