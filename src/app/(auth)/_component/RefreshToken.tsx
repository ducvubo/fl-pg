'use client'
import React, { useLayoutEffect } from 'react'
import { reFreshTokenNew } from '../auth.api'
import { useDispatch } from 'react-redux'
import { startAppUser } from '../auth.slice'
import { IUser } from '../auth.interface'

export default function RefreshToken() {
  const dispatch = useDispatch()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }
  const refreshToken = async () => {
    const res = await reFreshTokenNew()
    if (res?.code === 0 && res.data) {
      runAppUser(res.data)
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
