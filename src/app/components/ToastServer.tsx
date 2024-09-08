'use client'
import React from 'react'
import { Toast } from './Notification'

export default function ToastServer({ message }: { message: string }) {
  Toast('Thông báo', message, 'warning')
  return null
}
