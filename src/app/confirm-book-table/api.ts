'use server'

import { sendRequest } from '@/lib/api'

export const confirmBookTable = async ({ token }: { token: string }) => {
  const res = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/user-confirm`,
    method: 'PATCH',
    body: { book_tb_token_verify: token }
  })

  return res
}
