import React, { Suspense } from 'react'
import GetPageRestaurant from './_component/GetPageRestaurant'
import { getAllRestaurant } from './restaurant.api'
import { IRestaurant } from './restaurant.interface'
import LoadingServer from '@/components/LoadingServer'
import { redirect } from 'next/navigation'
import ToastServer from '@/app/components/ToastServer'
import { deleteCookiesAndRedirect } from '@/app/actions/action'

interface RestaurantPageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: RestaurantPageProps) {
  const res: IBackendRes<IModelPaginate<IRestaurant[]>> = await getAllRestaurant({
    current: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10'
  })

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
  const data = res.data.result.flat()

  return (
    <div>
      <GetPageRestaurant data={data} meta={res.data.meta} />
    </div>
  )
}

export default function Page(props: RestaurantPageProps) {
  return (
    <div>
      <Suspense fallback={<LoadingServer />}>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
