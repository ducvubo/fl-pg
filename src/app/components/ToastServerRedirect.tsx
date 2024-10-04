'use client'
import { useRouter } from 'next/navigation'
import { Toast } from './Notification'

export default function ToastSeverRedirect({ message, route }: { message: string; route: string }) {
  const router = useRouter()
  router.push(route)
  Toast('Thông báo', message, 'warning')
  return <></>
}
