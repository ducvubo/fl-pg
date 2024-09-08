'use client'
import React, { useState } from 'react'
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import Link from 'next/link'
import { GrRestaurant } from 'react-icons/gr'

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
    getItem(<Link href={'/dashboard/restaurant?page=1&size=10'}>Danh sách nhà hàng</Link>, '3'),
    getItem(<Link href={'/dashboard/restaurant/recycle?page=1&size=10'}>Nhà hàng đã xóa</Link>, '4')
  ]),
  getItem('Quản lý người dùng', '5', <UserOutlined />, [
    getItem(<Link href={'/dashboard/user/add'}>Thêm nguời dùng</Link>, '7'),
    getItem(<Link href={'/dashboard/restaurant?page=1&size=10'}>Danh sách người dùng</Link>, '8'),
    getItem(<Link href={'/dashboard/restaurant/recycle?page=1&size=10'}>Người dùng đã xóa</Link>, '9')
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        {/* <div className='demo-logo-vertical' /> */}
        <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline' items={items} />
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}
