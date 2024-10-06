import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import { redirect } from 'next/navigation'
import ToastServer from '@/app/components/ToastServer'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import dynamic from 'next/dynamic'
import LogoutPage from '@/app/(auth)/logout/page'
import { ICategory } from '../category.interface'
import { getCategoryById, getCategoryRecycle } from '../category.api'
import GetPageCategorytRecycle from '../_component/GetPageRecycle'
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
    const res: IBackendRes<IModelPaginate<ICategory>> = await getCategoryRecycle({
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
    return <GetPageCategorytRecycle data={res.data.result} meta={res.data.meta} />
  }

  const res: IBackendRes<ICategory> = await getCategoryById({ id })

  if (res.statusCode === 404) {
    return <ToastSeverRedirect message='Danh mục không tồn tại' route='/dashboard/category' />
  }

  if (res.code === -10) {
    return <LogoutPage />
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
  return <AddOrEdit id={id} inforCategory={res.data} />
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
