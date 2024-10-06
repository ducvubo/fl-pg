'use server'

import { sendRequest } from '@/lib/api'
import { ICategory } from './category.interface'

export const getAllCategory = async () => {
  const res: IBackendRes<ICategory[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/category`,
    method: 'GET'
  })

  return res
}

export const createCategory = async (payload: Omit<ICategory, '_id' | 'category_status' | 'isDeleted'>) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category`,
    method: 'POST',
    body: payload
  })

  return res
}

export const getCategoryPagination = async ({ current, pageSize }: { current: string; pageSize: string }) => {
  const res: IBackendRes<IModelPaginate<ICategory>> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/pagination`,
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

export const getCategoryRecycle = async ({ current, pageSize }: { current: string; pageSize: string }) => {
  const res: IBackendRes<IModelPaginate<ICategory>> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/recycle`,
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

export const getCategoryById = async ({ id }: { id: string }) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/${id}`,
    method: 'GET',
    nextOption: { cache: 'no-store' }
  })
  return res
}

export const updateCategory = async (payload: Omit<ICategory, 'category_status' | 'isDeleted'>) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteCategory = async ({ id }: { id: string }) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/${id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreCategory = async ({ id }: { id: string }) => {
  const res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/restore/${id}`,
    method: 'PATCH'
  })
  return res
}

export const updateStatusCategory = async ({
  _id,
  category_status
}: {
  _id: string
  category_status: 'enable' | 'disable'
}) => {
  let res: IBackendRes<ICategory> = await sendRequest({
    url: `${process.env.URL_SERVER}/category/update-status`,
    method: 'PATCH',
    body: { _id, category_status }
  })

  return res
}
