'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useLoading } from '../context/LoadingContext'
import { confirmBookTable } from './api'
import { Toast } from '../components/Notification'

export default function ConFirmBookTabel() {
  const { setLoading } = useLoading()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleConfirm = async () => {
    setLoading(true)
    if (!token) return
    try {
      const res = await confirmBookTable({ token })
      console.log(res)
      if (res?.statusCode === 200) {
        Toast('Thành công', 'Xác nhận đặt bàn thành công', 'success')
      }
      if (res.statusCode === 400) {
        if (Array.isArray(res.message)) {
          res.message.map((item: string) => {
            Toast('Lỗi', item, 'warning')
          })
        } else {
          Toast('Lỗi', res.message, 'warning')
        }
      }
      if (res.statusCode === 404) {
        Toast('Thất bại', res.message, 'warning')
      }
    } catch (error) {
      console.error(error)
      Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút1', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleConfirm()
  }, [])

  return <div>ConFirmBookTabel</div>
}
