import { IUser } from '@/app/(auth)/auth.interface'

export interface IUserModel extends IUser {
  us_password: string
  us_status: string
  isDeleted: boolean
}

export interface IRole {
  _id: string
  rl_name: string
}
