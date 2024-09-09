import { IUpLoadImage } from '../dashboard/restaurant/restaurant.interface'

export interface IToken {
  refresh_token: string
  access_token: string
}

export interface IUser {
  _id: string
  us_name: string
  us_email: string
  us_address: string
  us_phone: string
  us_gender: string
  us_role: {
    _id: string
    rl_name: string
    rl_description: string
  }
  us_avatar?: IUpLoadImage
}
