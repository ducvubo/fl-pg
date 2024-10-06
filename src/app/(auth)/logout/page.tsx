'use client'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { Toast } from '@/app/components/Notification'
import React, { useEffect } from 'react'
import { initialState, startAppUser } from '../auth.slice'
import { useDispatch } from 'react-redux'
import { IUser } from '../auth.interface'

export default function LogoutPage() {
  const dispatch = useDispatch()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }
  useEffect(() => {
    Toast('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error')
    runAppUser(initialState)
    deleteCookiesAndRedirect()
  }, [])
  return <></>
}
