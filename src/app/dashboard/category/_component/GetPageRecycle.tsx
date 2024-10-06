'use client'
import React, { useState } from 'react'
import { Button, Dropdown, Modal, Space, Switch, Table } from 'antd'
import type { MenuProps, TableColumnsType } from 'antd'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toast } from '@/app/components/Notification'
import { useLoading } from '@/app/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { ICategory } from '../category.interface'
import Image from 'next/image'
import { restoreCategory } from '../category.api'

interface Props {
  data: ICategory[]
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
}

export default function GetPageCategorytRecycle({ data, meta }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const handleRestore = async (id: string) => {
    setLoading(true)
    try {
      const res: IBackendRes<ICategory> = await restoreCategory({ id })
      if (res.statusCode === 200) {
        Toast('Thành công', 'Danh mục đã được khôi phục', 'success')
        router.refresh()
      } else if (res.statusCode === 404) {
        Toast('Thất bại', 'Danh mục không tồn tại', 'warning')
      } else if (res.code === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setLoading(false)
        Toast('Thông báo', res.message, 'warning')
      } else {
        Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
      }
    } catch (error) {
      Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns: TableColumnsType<ICategory> = [
    {
      title: 'Tên danh mục',
      width: 100,
      dataIndex: 'category_name',
      key: '0'
    },
    {
      title: 'Mô tả',
      width: 100,
      dataIndex: 'category_description',
      key: '2'
    },
    {
      title: 'Hình ảnh',
      width: 100,
      dataIndex: 'category_image',
      key: '3',
      render: (_, record) => {
        return (
          <div className='group h-28 px-6 py-3 mt-4'>
            <div className=' bg-white rounded-full w-16 h-16 flex justify-center items-center shadow-custom_categoty custom_categoty transition-all duration-250 ease-in-out'>
              <Image
                src={record.category_image.image_cloud}
                alt='vuducbo'
                width={50}
                height={50}
                className='rounded-full w-10 h-10 object-cover'
              />
            </div>
          </div>
        )
      }
    },
    {
      title: 'Action',
      key: 'operation1',
      fixed: 'right',
      width: 50,
      render: (_, record) => (
        <Button type='primary' onClick={() => handleRestore(record._id)}>
          Khôi phục
        </Button>
      )
    }
  ]

  const dataWithKeys = data.map((item) => ({ ...item, key: item._id }))

  const paginationConfig = {
    current: meta.current,
    pageSize: meta.pageSize,
    total: meta.totalItem,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    onChange: (page: number, pageSize: number) => {
      router.push(`/dashboard/category/recycle?page=${page}&size=${pageSize}`)
    }
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        scroll={{ x: 1200, y: 590 }}
        pagination={paginationConfig}
        className='h-[690px]'
      />
    </>
  )
}
