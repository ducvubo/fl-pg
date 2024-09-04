'use client'
import React, { useState } from 'react'
import { Button, Dropdown, Modal, Space, Switch, Table } from 'antd'
import type { MenuProps, TableColumnsType } from 'antd'
import { IRestaurant } from '../restaurant.interface'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteRestaurant, restoreRestaurant, updateModify } from '../restaurant.api'
import { Toast } from '@/app/components/Notification'
import { useLoading } from '@/app/context/LoadingContext'

interface Props {
  data: IRestaurant[]
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
}

export default function GetPageRestaurantRecycle({ data, meta }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const handleRestore = async (id: string) => {
    setLoading(true)
    try {
      const res: IBackendRes<IRestaurant> = await restoreRestaurant({ id })
      if (res.statusCode === 200) {
        Toast('Thành công', 'Nhà hàng đã được khôi phục', 'success')
        router.refresh()
      } else if (res.statusCode === 404) {
        Toast('Thất bại', 'Nhà hàng không tồn tại', 'warning')
      } else {
        Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
      }
    } catch (error) {
      Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns: TableColumnsType<IRestaurant> = [
    {
      title: 'Email',
      width: 100,
      dataIndex: 'restaurant_email',
      key: '0',
      fixed: 'left'
    },
    {
      title: 'Tên',
      width: 100,
      dataIndex: 'restaurant_name',
      key: '1',
      fixed: 'left'
    },
    {
      title: 'Danh mục',
      render: (_, record: IRestaurant) =>
        typeof record.restaurant_category === 'object' && 'category_name' in record.restaurant_category
          ? record.restaurant_category.category_name
          : 'Không có',
      key: '2',
      width: 100
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'restaurant_phone',
      key: '3',
      width: 100
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
      router.push(`/restaurant/recycle?page=${page}&size=${pageSize}`)
    }
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        scroll={{ x: 1500, y: 590 }}
        pagination={paginationConfig}
        className='h-[690px]'
      />
    </>
  )
}
