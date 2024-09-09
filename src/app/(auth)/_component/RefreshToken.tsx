'use client'
import React, { useLayoutEffect } from 'react'
import { reFreshTokenNew } from '../auth.api'
import { useDispatch } from 'react-redux'
import { startAppUser } from '../auth.slice'
import { IUser } from '../auth.interface'
import { useRouter } from 'next/navigation'

export default function RefreshToken() {
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }
  const refreshToken = async () => {
    const res = await reFreshTokenNew()
    if (res?.code === 0 && res.data) {
      runAppUser(res.data)
      const currentPathname = window.location.pathname

      // Navigate based on user role if not already on the target page
      if (res.data.us_role.rl_name === 'admin' && !currentPathname.startsWith('/dashboard')) {
        router.push('/dashboard')
      }
      if (res.data.us_role.rl_name !== 'admin') {
        router.push('/')
      }
    }
  }

  useLayoutEffect(() => {
    refreshToken()
    const interval = setInterval(() => {
      refreshToken()
    }, 1000 * 60 * 10)
    return () => clearInterval(interval)
  }, [])

  return <></>
}
