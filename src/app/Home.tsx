import Link from 'next/link'
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CarouselRestaurant from './components/Carousel'
import CarouselCategory from './components/CarouselCategory'
import OfferHot from './components/OfferHot'

export default function HomePage() {
  return (
    <>
      <Header />
      <div className='px-[196px] flex flex-col'>
        <CarouselCategory />
        <OfferHot />
      </div>
      <Footer />
    </>
  )
}
