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
