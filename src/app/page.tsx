import Image from 'next/image'
import HomePage from './Home'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()
  return (
    <>
      {/* {session} */}
      <HomePage />
    </>
  )
}
