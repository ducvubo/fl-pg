'use server'

import { sendRequest } from '@/lib/api'
import { IRestaurant } from './restaurant.interface'
import { deleteCookiesAndRedirect } from '@/app/actions/action'

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

  if (res.statusCode === 401) {
    await deleteCookiesAndRedirect()
  }

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

export const getAllRestaurant = async ({ current, pageSize }: { current: string; pageSize: string }) => {
  const res: IBackendRes<IModelPaginate<IRestaurant>> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants`,
    method: 'GET',
    queryParams: {
      current,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const getRestaurantById = async ({ id }: { id: string }) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/${id}`,
    method: 'GET',
    nextOption: { cache: 'no-store' }
  })
  return res
}

export const updateRestaurant = async (payload: IRestaurant) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteRestaurant = async ({ id }: { id: string }) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/${id}`,
    method: 'DELETE'
  })
  return res
}

export const updateModify = async ({
  _id,
  status,
  type
}: {
  _id: string
  status: 'active' | 'inactive' | 'banned' | boolean
  type: 'status' | 'state' | 'verify'
}) => {
  let res: IBackendRes<IRestaurant>

  switch (type) {
    case 'status':
      res = await sendRequest({
        url: `${process.env.URL_SERVER}/restaurants/status`,
        method: 'PATCH',
        body: { _id, status }
      })
      break
    case 'state':
      res = await sendRequest({
        url: `${process.env.URL_SERVER}/restaurants/state`,
        method: 'PATCH',
        body: { _id, status }
      })
      break
    case 'verify':
      res = await sendRequest({
        url: `${process.env.URL_SERVER}/restaurants/verify`,
        method: 'PATCH',
        body: { _id, status }
      })
      break
    default:
      throw new Error('Invalid type')
  }

  return res
}

export const getAllRestaurantRecycle = async ({ current, pageSize }: { current: string; pageSize: string }) => {
  const res: IBackendRes<IModelPaginate<IRestaurant>> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/recycle`,
    method: 'GET',
    queryParams: {
      current,
      pageSize
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const restoreRestaurant = async ({ id }: { id: string }) => {
  const res: IBackendRes<IRestaurant> = await sendRequest({
    url: `${process.env.URL_SERVER}/restaurants/restore/${id}`,
    method: 'PATCH'
  })
  return res
}
