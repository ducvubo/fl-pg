import { signIn } from '@/auth'
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <>
      <form
        action={async () => {
          'use server'
          await signIn()
        }}
      >
        <button type='submit'>Sign in</button>
      </form>
      <Link href='/register'>Register</Link>
    </>
  )
}
