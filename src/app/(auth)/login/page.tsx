import React from 'react'
import LoginForm from '../_component/LoginForm'
interface RestaurantPageProps {
  searchParams: { [key: string]: string }
}
export default function LoginPage({ searchParams }: RestaurantPageProps) {
  return <LoginForm />
}
