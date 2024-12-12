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
  
  export interface User {
    id?: string;
    name?: string;
    email?: string;
    // thêm các field khác nếu cần
  }
  
  export interface LoginResponse {
    metadata: {
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
      user: User;
    };
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