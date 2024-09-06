'use client'
import React, { useLayoutEffect } from 'react'
import { refreshTokenNew } from '../auth.api'

export default function RefreshToken() {
  const refreshToken = async () => {
    const res = await refreshTokenNew()
    console.log(res)
  }

  useLayoutEffect(() => {
    refreshToken()
    const interval = setInterval(() => {
      refreshToken() // Gọi lại API mỗi phút
    }, 1000 * 60 * 1)
    return () => clearInterval(interval)
  }, [])

  return <></>
}
