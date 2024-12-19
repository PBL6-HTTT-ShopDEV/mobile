import { TRole } from './common'
export interface IUser {
    id: string
    email: string
    fullName: string
    password: string
    phoneNumber: string
    address: string
    role: TRole
  }
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface SignupPayload {
    name: string;
    email: string;
    password: string;
  }
  
  export interface User {
    _id: string;
    email: string;
    name: string;
    phone_number?: string;
    address?: string;
    date_of_birth?: string;
    avatar?: string;
    role?: string;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface LoginResponse {
    code: number;
    message: string;
    metadata: {
      tokens: {
        accessToken: string;
        refreshToken?: string;
      };
      account: User;
    };
    status: string;
  }
  
  export interface AuthState {
    user: Omit<IUser, 'password'> | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    isAuthenticated: boolean;
  }
  
  export interface AuthContextType extends AuthState {
    login: (credentials: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    socialLogin: (provider: 'facebook' | 'google' | 'twitter', token: string) => Promise<void>;
    updateUser: (userData: Partial<Omit<IUser, 'password'>>) => Promise<void>;
  }
  
  export interface UpdateProfilePayload {
    name?: string;
    phone_number?: string;
    address?: string;
    date_of_birth?: string;
    avatar?: string;
  }
