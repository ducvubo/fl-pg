'use server'

import { sendRequest } from '@/lib/api'
import { IAmenity, IRestaurant, IRestaurantType } from './restaurant.interface'

export const getTag = async (name: string, type: string) => {
  let url = ''

  switch (type) {
    case 'amenity':
      url = `${process.env.URL_SERVER}/amenities/search`
      break
    case 'restaurent-type':
      url = `${process.env.URL_SERVER}/restaurant-type/search`
      break
    default:
      throw new Error('Invalid type')
  }

  const res: IBackendRes<any> = await sendRequest({
    method: 'GET',
    url: url,
    nextOption: {
      cache: 'no-store'
    },
    queryParams: {
      tag_name: name
    }
  })
  console.log(res)
  return res
}

export const addTag = async (payload: any, type: string) => {
  let url = ''
  let value
  switch (type) {
    case 'amenity':
      url = `${process.env.URL_SERVER}/amenities`
      value = {
        amenity_name: payload.tag_name
      }
      break
    case 'restaurent-type':
      url = `${process.env.URL_SERVER}/restaurant-type`
      value = {
        restaurant_type_name: payload.tag_name
      }
      break
    default:
      throw new Error('Invalid type')
  }
  const res: IBackendRes<any> = await sendRequest({
    method: 'POST',
    url: url,
    body: value
  })
  return res
}

export const createRestaurant = async (payload: IRestaurant) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants`,
    method: 'POST',
    body: payload
  })

  return res
}
