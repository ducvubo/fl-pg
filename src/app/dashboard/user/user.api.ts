'use server'

import { sendRequest } from '@/lib/api'
import { IRole, IUserModel } from './user.interface'
import { IUser } from '@/app/(auth)/auth.interface'

export const getRoleUser = async () => {
  const res: IBackendRes<IRole[]> = await sendRequest({
    url: `${process.env.URL_SERVER}/role/user`,
    method: 'GET'
  })

  return res
}

export const createUser = async (data: IUserModel) => {
  const res: IBackendRes<IUserModel> = await sendRequest({
    url: `${process.env.URL_SERVER}/users`,
    method: 'POST',
    body: data
  })

  return res
}

export const getAllUser = async ({ current, pageSize }: { current: string; pageSize: string }, type: string) => {
  const url = type === 'all' ? `${process.env.URL_SERVER}/users` : `${process.env.URL_SERVER}/users/recycle`
  const res: IBackendRes<IModelPaginate<IUserModel[]>> = await sendRequest({
    url: url,
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

export const getUserById = async ({ id }: { id: string }) => {
  const res: IBackendRes<IUserModel> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/${id}`,
    method: 'GET',
    nextOption: { cache: 'no-store' }
  })
  return res
}

export const updateUser = async (payload: IUserModel) => {
  const res: IBackendRes<IUserModel> = await sendRequest({
    url: `${process.env.URL_SERVER}/users`,
    method: 'PATCH',
    body: payload
  })
  return res
}

export const deleteUser = async ({ id }: { id: string }) => {
  const res: IBackendRes<IUserModel> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/${id}`,
    method: 'DELETE'
  })
  return res
}

export const restoreUser = async ({ id }: { id: string }) => {
  const res: IBackendRes<IUserModel> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/restore/${id}`,
    method: 'PATCH'
  })
  return res
}

export const updateStatus = async ({ _id, status }: { _id: string; status: 'enable' | 'disable' }) => {
  let res: IBackendRes<IUserModel> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/status`,
    method: 'PATCH',
    body: { _id, status }
  })

  return res
}
