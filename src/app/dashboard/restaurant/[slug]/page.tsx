import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import { getAllRestaurantRecycle, getRestaurantById } from '../restaurant.api'
import { IRestaurant } from '../restaurant.interface'
import GetPageRestaurantRecycle from '../_component/GetPageRecycle'
import { redirect } from 'next/navigation'
import ToastServer from '@/app/components/ToastServer'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import dynamic from 'next/dynamic'
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
    return <AddOrEdit id='add' />
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IRestaurant[]>> = await getAllRestaurantRecycle({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10'
    })
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
    return <GetPageRestaurantRecycle data={data} meta={res.data.meta} />
  }

  const res: IBackendRes<IRestaurant> = await getRestaurantById({ id })

  if (res.statusCode === 404) {
    return <ToastSeverRedirect message='Nhà hàng không tồn tại' route='/dashboard/restaurant' />
  }

  if (res.code === -10) {
    deleteCookiesAndRedirect()
    // redirect('/login')
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
  return <AddOrEdit id={id} inforRestaurant={res.data} />
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
