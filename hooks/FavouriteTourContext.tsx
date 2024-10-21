import React, { createContext, useState, ReactNode } from 'react';
import { ITour } from '../types/Tour.types';

interface FavoriteTourContextProps {
  favoriteTours: ITour[];
  toggleFavoriteTour: (tour: ITour) => void;
}

// Tạo context
const FavoriteTourContext = createContext<FavoriteTourContextProps | undefined>(undefined);

export const FavoriteTourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteTours, setFavoriteTours] = useState<ITour[]>([]);

  const toggleFavoriteTour = (tour: ITour) => {
    setFavoriteTours((prevTours) => {
      const isFavorited = prevTours.some((t) => t.tour_id === tour.tour_id); // Kiểm tra xem tour đã tồn tại chưa
      if (isFavorited) {
        // Nếu tour đã được yêu thích, xóa khỏi danh sách
        console.log('Tour được thao tác:', tour.tour_id);
        return prevTours.filter((t) => t.tour_id !== tour.tour_id);
        
      } else {
        // Nếu chưa, thêm tour vào danh sách yêu thích
        console.log('Adding tour:', tour.tour_id);
        return [...prevTours, tour];
      }
    });
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
