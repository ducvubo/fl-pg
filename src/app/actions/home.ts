'use server'

import { sendRequest } from '@/lib/api'

export interface IRestaurantHome {
  _id: string
  restaurant_name: string
  restaurant_slug: string
  restaurant_banner: {
    image_cloud: string
    image_custom: string
  }
  restaurant_price: {
    restaurant_price_option: 'range' | 'down' | 'up'
    restaurant_price_min?: number
    restaurant_price_max?: number
    restaurant_price_amount?: number
  }
}

export const getRestaurant = async () => {
  const res: IBackendRes<IRestaurantHome[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/home`,
    method: 'GET',
    nextOption: { cache: 'no-store' }
  })
  return res
}
