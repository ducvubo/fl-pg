import Link from 'next/link'
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CarouselRestaurant from './components/Carousel'

export default function HomePage() {
  return (
    <>
      <Header />
      <CarouselRestaurant />
      {/* // <div className='flex flex-col'>
    //   <Link href='/login'>Login</Link>
    //   <Link href='/register'>Register</Link>
    // </div> */}
      <Footer />
    </>
  )
}
