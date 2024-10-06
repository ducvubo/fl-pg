import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import { redirect } from 'next/navigation'
import ToastServer from '@/app/components/ToastServer'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import LogoutPage from '@/app/(auth)/logout/page'
import { getCategoryPagination } from './category.api'
import { IRestaurant } from '../restaurant/restaurant.interface'
import GetPageCategory from './_component/GetPageCategory'
import { ICategory } from './category.interface'

interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  const res: IBackendRes<IModelPaginate<ICategory>> = await getCategoryPagination({
    current: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10'
  })

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

  return (
    <div>
      {/* <GetPa data={data} meta={res.data.meta} /> */}
      <GetPageCategory data={res.data.result} meta={res.data.meta} />
    </div>
  )
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
