import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Thông tin nhà hàng'
}

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
