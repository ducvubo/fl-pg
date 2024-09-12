'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from 'antd'
import Link from 'next/link'
import { logout } from '../(auth)/auth.api'
import { initialState, startAppUser } from '../(auth)/auth.slice'

export default function ThongTinTaiKhoan() {
  const inforUser = useSelector((state: RootState) => state.inforUser)
  const dispatch = useDispatch()
  console.log(inforUser)


  const handleLogout = async () => {
    await logout()
    dispatch(startAppUser(initialState))
  
  }

  return (
    <section className='bg-[#eeeeee] py-10'>
      <div className='max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='p-4 border-b'>
          <div className='flex items-center justify-between'>
            <div className='flex'>
              <div>
                <Image
                  // src={inforUser.us_avatar ? inforUser?.us_avatar?.image_cloud : '/image/avatar-trang-4.jpg'}
                  src={'/image/avatar-trang-4.jpg'}
                  width={50}
                  height={50}
                  alt='vuducbo'
                  className='rounded-full'
                />
                <Button type='primary' className='w-16 !h-5 -ml-1 mt-3'>
                  chọn ảnh
                </Button>
              </div>
              <div className='flex flex-col gap-2 ml-4'>
                <span className='text-sm font-bold text-[#808080]'>
                  ID PasGo : <span className='text-black font-semibold'>{inforUser._id}</span>
                </span>
                <span className='text-sm font-bold text-[#808080]'>
                  Email : <span className='text-black font-semibold'>{inforUser.us_email}</span>
                </span>
                <span className='text-sm font-bold text-[#808080]'>
                  Số điện thoại : <span className='text-black font-semibold'>{inforUser.us_phone}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='divide-y'>
          <Link href={'/thong-tin-tai-khoan'} className='flex items-center justify-between p-4'>
            <span className='text-gray-700'>Thông tin tài khoản</span>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </Link>
          <Link href={'/thong-tin-tai-khoan'} className='flex items-center justify-between p-4'>
            <span className='text-gray-700'>Quản lý mật khẩu</span>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </Link>
          <Link href={'/thong-tin-tai-khoan'} className='flex items-center justify-between p-4'>
            <span className='text-gray-700'>Danh sách yêu thích</span>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </Link>
          <Link href={'/thong-tin-tai-khoan'} className='flex items-center justify-between p-4'>
            <span className='text-gray-700'>Lịch sử đơn Đặt chỗ</span>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </Link>
          <Link href={'/thong-tin-tai-khoan'} className='flex items-center justify-between p-4'>
            <span className='text-gray-700'>Liên kết tài khoản</span>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </Link>
          <div onClick={handleLogout} className='flex items-center justify-between p-4 cursor-pointer'>
            <span className='text-gray-700'>Thoát</span>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' />
          </div>
        </div>
      </div>
      <div></div>
    </section>
  )
}
