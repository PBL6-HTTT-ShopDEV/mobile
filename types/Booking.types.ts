import { ITour } from "./Tour.types";

export type BookingStatus = 'pending' | 'success' | 'failed';

export interface IBooking {
  _id?: string;
  tour: string | ITour; // Có thể là ID của tour hoặc object tour đầy đủ
  user?: string; // ID của user
  status: BookingStatus;
  total_price: number;
  number_of_people: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user_info?: {
    fullName: string;
    phone: string;
    address: string;
    email: string;
  };
}