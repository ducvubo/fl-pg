'use client'
import React from 'react'
import { Toast } from './Notification'
import { useRouter } from 'next/navigation'

export default function ToastServer({ message }: { message: string }) {
  Toast('Thông báo', message, 'warning')
  return null
}

