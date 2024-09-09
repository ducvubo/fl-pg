import React, { Suspense } from 'react'

import LoadingServer from '@/components/LoadingServer'
import ToastServer from '@/app/components/ToastServer'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { getAllUser } from './user.api'
import { IUserModel } from './user.interface'
import GetPageUser from './_component/GetPageUser'

interface UserPageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: UserPageProps) {
  const res: IBackendRes<IModelPaginate<IUserModel[]>> = await getAllUser(
    {
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10'
    },
    'all'
  )

  if (res.code === -10) {
    deleteCookiesAndRedirect()
  }
  if (res.code === -11) {
    return <ToastServer message='Bạn không có quyền truy cập' />
  }
  if (!res || !res.data) {
    return (
      <>
        <div>Error fetching data</div>
      </>
    )
  }
  const data = res.data.result.flat()

  return (
    <div>
      <GetPageUser data={data} meta={res.data.meta} />
    </div>
  )
}

export default function Page(props: UserPageProps) {
  return (
    <div>
      <Suspense fallback={<LoadingServer />}>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
