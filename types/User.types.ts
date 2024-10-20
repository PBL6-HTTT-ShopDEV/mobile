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