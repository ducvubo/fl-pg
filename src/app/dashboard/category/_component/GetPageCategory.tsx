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
import { deleteCategory, updateStatusCategory } from '../category.api'

interface Props {
  data: ICategory[]
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
}

export default function GetPageCategory({ data, meta }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setselectedCategory] = useState<ICategory | null>(null)

  const showModal = (restaunrat: ICategory) => {
    setselectedCategory(restaunrat)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    if (selectedCategory) {
      await handleDelete(selectedCategory._id)
    }
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setselectedCategory(null)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const res: IBackendRes<ICategory> = await deleteCategory({ id })
      if (res.statusCode === 200) {
        Toast('Thành công', 'Danh mục đã được chuyển vào thùng rác', 'success')
        router.refresh()
      } else if (res.code === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        // router.push('/login')
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setLoading(false)
        Toast('Thông báo', res.message, 'warning')
      } else if (res.statusCode === 404) {
        Toast('Thất bại', 'Danh mục không tồn tại', 'warning')
      } else {
        Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
      }
    } catch (error) {
      Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
    } finally {
      setLoading(false)
      setselectedCategory(null)
    }
  }

  const handleUpdateStatus = async ({
    _id,
    category_status
  }: {
    category_status: 'enable' | 'disable'
    _id: string
  }) => {
    setLoading(true)
    try {
      const res: IBackendRes<ICategory> = await updateStatusCategory({ _id, category_status })
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
      } else if (res.code === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        await deleteCookiesAndRedirect()
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
      title: 'Trạng thái',
      key: '4',
      width: 150,
      render: (_, record) => {
        return (
          <Button
            type={record.category_status === 'enable' ? 'primary' : 'default'}
            danger={record.category_status === 'disable'}
            onClick={() =>
              handleUpdateStatus({
                _id: record._id,
                category_status: record.category_status === 'enable' ? 'disable' : 'enable'
              })
            }
          >
            {record.category_status === 'enable' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </Button>
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
            label: <Link href={`/dashboard/category/${record._id}`}>Sửa</Link>
          },
          {
            key: '2',
            label: <span onClick={() => showModal(record)}>Xóa</span>
            // label: <span>Xóa</span>
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
      router.push(`/dashboard/category?page=${page}&size=${pageSize}`)
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
      <Modal
        title='Xác nhận xóa'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Xác nhận'
        cancelText='Hủy'
      >
        <p>Bạn có chắc chắn muốn chuyển danh mục '{selectedCategory?.category_name}'' vào thùng rác không?</p>
      </Modal>
    </>
  )
}
