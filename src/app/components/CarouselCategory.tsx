'use client'
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79'
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: '10px', zIndex: 1, color: 'black' }}
      onClick={onClick}
    />
  )
}

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', left: '10px', zIndex: 1, color: 'black' }}
      onClick={onClick}
    />
  )
}

export default function CarouselCategory() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 10, // Hiển thị 5 item trên 1 màn hình
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />, // Custom next button
    prevArrow: <PrevArrow />
  }

  return (
    <section className='h-20 mt-10 mb-32'>
      <span className='font-bold text-3xl'>Danh mục</span>
      <Slider {...settings}>
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className='group cursor-pointer h-28 px-6 py-3 mt-4'>
            <div className=' bg-white rounded-full w-16 h-16 flex justify-center items-center shadow-custom_categoty custom_categoty transition-all duration-250 ease-in-out'>
              <Image
                src={'/image/638441027537096717-icon-nuong.png'}
                alt='vuducbo'
                width={50}
                height={50}
                className='rounded-full w-10 h-10 object-cover group-hover:opacity-80'
              />
            </div>
            <span className='font-bold flex justify-center items-center group-hover:text-[#d02028]'>Nướng</span>
          </div>
        ))}
      </Slider>
    </section>
  )
}
