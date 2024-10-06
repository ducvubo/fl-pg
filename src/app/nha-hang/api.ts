'use server'

import { sendRequest } from '@/lib/api'
import { IRestaurant } from '../dashboard/restaurant/restaurant.interface'
import { cookies } from 'next/headers'
export interface IRestaurantBySlug
  extends Omit<IRestaurant, 'restaurant_password' | 'restaurant_status' | 'restaurant_state'> {}

export const getRestaurantBySlug = async (slug: string) => {
  const res: IBackendRes<IRestaurantBySlug> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/slug/${slug}`,
    method: 'GET',
    nextOption: {
      cache: 'no-store'
    }
  })

  return res
}

export const createBookTable = async (payload: any) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table`,
    method: 'POST',
    body: payload
  })
  return res
}
