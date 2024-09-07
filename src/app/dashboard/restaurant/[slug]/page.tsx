import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import { getAllRestaurantRecycle, getRestaurantById } from '../restaurant.api'
import { IRestaurant } from '../restaurant.interface'
import GetPageRestaurantRecycle from '../_component/GetPageRecycle'

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
    if (!res || !res.data) {
      return <div>Error fetching data</div>
    }

    const data = res.data.result.flat()
    return <GetPageRestaurantRecycle data={data} meta={res.data.meta} />
  }

  const inforRestaurant: IBackendRes<IRestaurant> = await getRestaurantById({ id })
  return (
    <div>
      <AddOrEdit id={id} inforRestaurant={inforRestaurant.data} />
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
