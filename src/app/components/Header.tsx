'use client'
import { ChevronDown, User } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Span } from 'next/dist/trace'

export default function Header() {
  const inforUser = useSelector((state: RootState) => state.inforUser)

  return (
    <nav className='bg-white shadow'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link href={'/'} className='text-red-600 text-2xl font-bold'>PasGo</Link>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Gần bạn
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Bộ sưu tập
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Ăn uống
                <ChevronDown className='ml-1 h-4 w-4' />
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Nhà hàng uy tín
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Ưu đãi hot
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Mới nhất
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Tin tức & Blog
                <ChevronDown className='ml-1 h-4 w-4' />
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Video PasGo
                <ChevronDown className='ml-1 h-4 w-4' />
              </a>
            </div>
          </div>
          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            <div className='relative group flex'>
              <button
                type='button'
                className='bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <span className='sr-only'>Account menu</span>
                <User className='h-6 w-6' aria-hidden='true' />
              </button>
              <span className='ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                {inforUser.us_email ? inforUser.us_email : 'Tài khoản'}
              </span>
              <div className='absolute right-0 left-2 top-9 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block'>
                {!inforUser.us_email ? (
                  <>
                    <Link href='/register' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                      Đăng ký
                    </Link>
                    <Link href='/login' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                      Đăng nhập
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href='/thong-tin-tai-khoan' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                      Thông tin tài khoản
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
