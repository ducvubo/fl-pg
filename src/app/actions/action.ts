'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function deleteCookiesAndRedirect() {
  cookies().delete('access_token')
  cookies().delete('refresh_token')
  redirect('/login')
}

export async function deleteCookie() {
  cookies().delete('access_token')
  cookies().delete('refresh_token')

  return null
}
