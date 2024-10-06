'use client'
import { Button, Popover } from 'antd'
import React from 'react'
import { FaUser } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Link from 'next/link'
import Image from 'next/image'
import { deleteCookie } from '../actions/action'
import { initialState, startAppUser } from '../(auth)/auth.slice'
import { IUser } from '../(auth)/auth.interface'

export default function AccountHeader() {
  const inforUser = useSelector((state: RootState) => state.inforUser)
  const dispatch = useDispatch()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }
  const handleLogout = () => {
    deleteCookie()
    runAppUser(initialState)
  }
  const accountContent = (
    <div className='flex flex-col gap-2'>
      <Link href='/login'>
        <Button className='!w-32 !bg-[#d02028] !text-white hover:!border-none'>Đăng nhập</Button>
      </Link>
      <Link href='/register'>
        <Button className='!w-32 !bg-[#d02028] !text-white hover:!border-none'>Đăng ký</Button>
      </Link>
    </div>
  )

  const accountInfor = (
    <div className='flex flex-col'>
      <Link href={'/thong-tin-tai-khoan'}>
        <span className='h-9 font-semibold text-blue-600 flex justify-center cursor-pointer '>Thông tin tài khoản</span>
      </Link>
      <span className='h-9 font-semibold text-blue-600 flex justify-center cursor-pointer '>Quản lý mật khẩu</span>
      <span className='h-9 font-semibold text-blue-600 flex justify-center cursor-pointer '>Lịch sử đặt chỗ</span>
      <Button className='!bg-[#d02028] !text-white hover:!border-none' onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  )

  return (
    <Popover content={inforUser.us_email ? accountInfor : accountContent} trigger='hover'>
      <div className='flex justify-end cursor-pointer items-center'>
        {inforUser.us_avatar?.image_cloud ? (
          <Image
            src={inforUser.us_avatar.image_cloud}
            width={100}
            height={100}
            alt='vuducbo'
            className='w-10 h-10 rounded-full'
          />
        ) : (
          <FaUser />
        )}
        <span className='font-semibold ml-1 mt-1'>{inforUser.us_email ? inforUser.us_email : 'Tài khoản'}</span>
      </div>
    </Popover>
  )
}
