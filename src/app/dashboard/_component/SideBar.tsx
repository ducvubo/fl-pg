'use client'
import React, { useEffect, useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import Link from 'next/link'
import { GrRestaurant } from 'react-icons/gr'
import { BiSolidCategory } from 'react-icons/bi'
import { usePathname } from 'next/navigation'
const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Quản lý nhà hàng', '1', <GrRestaurant />, [
    getItem(<Link href={'/dashboard/restaurant/add'}>Thêm nhà hàng</Link>, '2'),
    getItem(<Link href={'/dashboard/restaurant?page=1&size=10'}>Danh sách nhà hàng</Link>, '1'),
    getItem(<Link href={'/dashboard/restaurant/recycle?page=1&size=10'}>Nhà hàng đã xóa</Link>, '4')
  ]),
  getItem('Quản lý người dùng', '5', <UserOutlined />, [
    getItem(<Link href={'/dashboard/user/add'}>Thêm nguời dùng</Link>, '7'),
    getItem(<Link href={'/dashboard/user?page=1&size=10'}>Danh sách người dùng</Link>, '5'),
    getItem(<Link href={'/dashboard/user/recycle?page=1&size=10'}>Người dùng đã xóa</Link>, '9')
  ]),
  getItem('Quản lý danh mục nhà hàng', '10', <BiSolidCategory />, [
    getItem(<Link href={'/dashboard/category/add'}>Thêm danh mục nhà hàng</Link>, '11'),
    getItem(<Link href={'/dashboard/category?page=1&size=10'}>Danh sách danh mục nhà hàng</Link>, '10'),
    getItem(<Link href={'/dashboard/category/recycle?page=1&size=10'}>Danh mục nhà hàng đã xóa</Link>, '13')
  ])
]

export default function SideBar({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const pathname = usePathname() // Sử dụng usePathname để lấy URL hiện tại
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    // Kiểm tra chính xác pathname để set key tương ứng
    if (pathname.includes('/dashboard/restaurant')) {
      // Xác định menu cha và menu con dựa trên đường dẫn
      if (pathname === '/dashboard/restaurant/add') {
        setSelectedKeys(['2'])
      } else if (pathname.includes('/dashboard/restaurant?page=1&size=10')) {
        setSelectedKeys(['3'])
      } else if (pathname.includes('/dashboard/restaurant/recycle')) {
        setSelectedKeys(['4'])
      } else {
        setSelectedKeys(['1']) // Menu cha
      }
    } else if (pathname.includes('/dashboard/user')) {
      if (pathname === '/dashboard/user/add') {
        setSelectedKeys(['7'])
      } else if (pathname.includes('/dashboard/user?page=1&size=10')) {
        setSelectedKeys(['8'])
      } else if (pathname.includes('/dashboard/user/recycle')) {
        setSelectedKeys(['9'])
      } else {
        setSelectedKeys(['5']) // Menu cha
      }
    } else if (pathname.includes('/dashboard/category')) {
      if (pathname === '/dashboard/category/add') {
        setSelectedKeys(['11'])
      } else if (pathname.includes('/dashboard/category?page=1&size=10')) {
        setSelectedKeys(['12'])
      } else if (pathname.includes('/dashboard/category/recycle')) {
        setSelectedKeys(['13'])
      } else {
        setSelectedKeys(['10']) // Menu cha
      }
    } else {
      setSelectedKeys([]) // Reset nếu không có menu nào khớp
    }
  }, [pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={270}
        style={{
          backgroundColor: colorBgContainer
        }}
      >
        <Menu theme='light' selectedKeys={selectedKeys} mode='inline' items={items} />
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}
