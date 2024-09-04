'use client'
import React, { useState } from 'react'
import { Button, Dropdown, Modal, Space, Switch, Table } from 'antd'
import type { MenuProps, TableColumnsType } from 'antd'
import { IRestaurant } from '../restaurant.interface'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteRestaurant, updateModify } from '../restaurant.api'
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

export default function GetPageRestaurant({ data, meta }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRestaurant, setselectedRestaurant] = useState<IRestaurant | null>(null)

  const showModal = (restaunrat: IRestaurant) => {
    setselectedRestaurant(restaunrat)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    if (selectedRestaurant) {
      await handleDelete(selectedRestaurant._id)
    }
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setselectedRestaurant(null)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const res: IBackendRes<IRestaurant> = await deleteRestaurant({ id })
      if (res.statusCode === 200) {
        Toast('Thành công', 'Nhà hàng đã được chuyển vào thùng rác', 'success')
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
      setselectedRestaurant(null)
    }
  }

  const handleUpdateModify = async ({
    _id,
    status,
    type
  }: {
    status: 'active' | 'inactive' | 'banned' | boolean
    _id: string
    type: 'status' | 'verify' | 'state'
  }) => {
    setLoading(true)
    try {
      const res: IBackendRes<IRestaurant> = await updateModify({ _id, status, type })
      if (res.statusCode === 200) {
        Toast('Thành công', res.message, 'success')
        router.refresh()
      } else if (res.statusCode === 400) {
        if (Array.isArray(res.message)) {
          res.message.map((item: string) => {
            Toast('Lỗi', item, 'warning')
          })
        } else {
          Toast('Lỗi', res.message, 'warning')
        }
      } else if (res.statusCode === 404) {
        Toast('Thất bại', res.message, 'warning')
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
      title: 'Trạng thái',
      key: '4',
      width: 150,
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <span onClick={() => handleUpdateModify({ _id: record._id, status: 'active', type: 'status' })}>
                Chưa hoạt động
              </span>
            )
          },
          {
            key: '2',
            label: (
              <span onClick={() => handleUpdateModify({ _id: record._id, status: 'inactive', type: 'status' })}>
                Đang hoạt động
              </span>
            )
          },
          {
            key: '3',
            label: (
              <span onClick={() => handleUpdateModify({ _id: record._id, status: 'banned', type: 'status' })}>
                Cấm hoạt động
              </span>
            )
          }
        ]
        return (
          <div className='flex flex-col'>
            <Button
              type='primary'
              danger
              onClick={() => handleUpdateModify({ _id: record._id, status: !record.restaurant_verify, type: 'verify' })}
            >
              {record.restaurant_verify === true ? 'Đã xác minh' : 'Chưa xác minh'}
            </Button>

            <Button
              onClick={() => handleUpdateModify({ _id: record._id, status: !record.restaurant_state, type: 'state' })}
            >
              {record.restaurant_state === true ? 'Đang mở cửa' : 'Đang đóng'}
            </Button>
            <Space direction='vertical'>
              <Space wrap>
                <Dropdown menu={{ items }} placement='bottomLeft'>
                  <Button type='dashed' danger>
                    {record.restaurant_status === 'active'
                      ? 'Chưa hoạt động'
                      : record.restaurant_status === 'inactive'
                      ? 'Đang hoạt động'
                      : 'Cấm hoạt động'}
                  </Button>
                </Dropdown>
              </Space>
            </Space>
          </div>
        )
      }
    },

    {
      title: 'Action',
      key: 'operation1',
      fixed: 'right',
      width: 50,
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: <Link href={`/restaurant/${record._id}`}>Sửa</Link>
          },
          {
            key: '2',
            label: <span onClick={() => showModal(record)}>Xóa</span>
          }
        ]

        return (
          <Space direction='vertical'>
            <Space wrap>
              <Dropdown menu={{ items }} placement='bottomLeft'>
                <Button>Action</Button>
              </Dropdown>
            </Space>
          </Space>
        )
      }
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
      router.push(`/restaurant?page=${page}&size=${pageSize}`)
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
      <Modal
        title='Xác nhận xóa'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Xác nhận'
        cancelText='Hủy'
      >
        <p>Bạn có chắc chắn muốn chuyển nhà hàng {selectedRestaurant?.restaurant_name} vào thùng rác không?</p>
      </Modal>
    </>
  )
}
