'use client'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'

export default function HomePage() {
  const userInfo = useSelector((state: RootState) => state.inforUser)
  return (
    <div className='flex flex-col'>
      <Link href='/login'>Login</Link>
      <Link href='/register'>Register</Link>
    </div>
  )
}
