import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import GetPageUserRecycle from '../_component/GetPageUserRecycle'
import { IUserModel } from '../user.interface'
import ToastServer from '@/app/components/ToastServer'
import { getAllUser, getUserById } from '../user.api'
import dynamic from 'next/dynamic'
import LogoutPage from '@/app/(auth)/logout/page'
const ToastSeverRedirect = dynamic(() => import('@/app/components/ToastServerRedirect'), {
  ssr: false
})
interface PageProps {
  searchParams: { [key: string]: string }
  params: { slug: string }
}

async function Component({ searchParams, params }: PageProps) {
  const id = params.slug
  if (id === 'add') {
    return <AddOrEdit id={'add'} />
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IUserModel>> = await getAllUser(
      {
        current: searchParams.page ? searchParams.page : '1',
        pageSize: searchParams.size ? searchParams.size : '10'
      },
      'recycle'
    )
    if (res.code === -10) {
      return <LogoutPage />
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

    // const data = res.data.result.flat()
    return <GetPageUserRecycle data={res.data.result} meta={res.data.meta} />
  }

  const res: IBackendRes<IUserModel> = await getUserById({ id })

  if (res.statusCode === 404) {
    return <ToastSeverRedirect message='Nhà hàng không tồn tại' route='/dashboard/user' />
  }

  if (res.code === -10) {
    return <LogoutPage />
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
  return <AddOrEdit id={id} inforUser={res.data} />
}

export default function Page(props: PageProps) {
  return (
    <div>
      <Suspense fallback={<LoadingServer />}>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
