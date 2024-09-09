'use client'
import React, { useState } from 'react'
import { Button, Dropdown, Modal, Space, Switch, Table } from 'antd'
import type { MenuProps, TableColumnsType } from 'antd'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toast } from '@/app/components/Notification'
import { useLoading } from '@/app/context/LoadingContext'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IUserModel } from '../user.interface'
import { deleteUser, updateStatus } from '../user.api'

interface Props {
  data: IUserModel[]
  meta: {
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }
}

export default function GetPageUser({ data, meta }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setselectedUser] = useState<IUserModel | null>(null)

  const showModal = (restaunrat: IUserModel) => {
    setselectedUser(restaunrat)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    if (selectedUser) {
      await handleDelete(selectedUser._id)
    }
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setselectedUser(null)
  }

  const handleUpdateStatus = async ({ _id, status }: { status: 'enable' | 'disable'; _id: string }) => {
    setLoading(true)
    try {
      const res: IBackendRes<IUserModel> = await updateStatus({ _id, status })
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

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const res: IBackendRes<IUserModel> = await deleteUser({ id })
      if (res.statusCode === 200) {
        Toast('Thành công', 'Người dùng đã được chuyển vào thùng rác', 'success')
        router.refresh()
      } else if (res.code === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setLoading(false)
        Toast('Thông báo', res.message, 'warning')
      } else if (res.statusCode === 404) {
        Toast('Thất bại', 'Người dùng không tồn tại', 'warning')
      } else {
        Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
      }
    } catch (error) {
      Toast('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
    } finally {
      setLoading(false)
      setselectedUser(null)
    }
  }

  const columns: TableColumnsType<IUserModel> = [
    {
      title: 'Email',
      width: 30,
      dataIndex: 'us_email',
      key: '0',
      fixed: 'left'
    },
    {
      title: 'Tên',
      width: 30,
      dataIndex: 'us_name',
      key: '1'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'us_phone',
      key: '3',
      width: 30
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'us_address',
      key: '3',
      width: 30
    },

    {
      title: 'Trạng thái',
      key: '4',
      width: 150,
      render: (_, record) => {
        return (
          <Button
            type='primary'
            onClick={() =>
              handleUpdateStatus({ _id: record._id, status: record.us_status === 'enable' ? 'disable' : 'enable' })
            }
          >
            {record.us_status === 'enable' ? 'Đang hoạt động' : 'Đã khóa'}
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
            label: <Link href={`/dashboard/user/${record._id}`}>Sửa</Link>
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
      router.push(`/dashboard/user?page=${page}&size=${pageSize}`)
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
        <p>Bạn có chắc chắn muốn chuyển người dùng {selectedUser?.us_name} vào thùng rác không?</p>
      </Modal>
    </>
  )
}
