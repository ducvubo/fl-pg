'use client'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import { GrFormNextLink } from 'react-icons/gr'
import { getRestaurant, IRestaurantHome } from '../actions/home'
import { Toast } from './Notification'
import Link from 'next/link'

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79'
}

export const NextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div className={className} style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} onClick={onClick} />
  )
}

export const PrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return <div className={className} style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} onClick={onClick} />
}

export default function CarouselRestaurant() {
  const [listRestaurant, setListRestaurant] = useState<IRestaurantHome[]>([])

  const listRestaurants = async () => {
    const res: IBackendRes<IRestaurantHome[]> = await getRestaurant()
    if (res.statusCode === 200 && res.data) {
      setListRestaurant(res.data)
    } else {
      Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút', 'error')
    }
  }
  useEffect(() => {
    listRestaurants()
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 5 item trên 1 màn hình
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />, // Custom next button
    prevArrow: <PrevArrow />
  }

  console.log(listRestaurant)

  return (
    <div className='mx-48 my-10'>
      <Slider {...settings}>
        {/* {Array.from({ length: 8 }).map((_, index) => ( */}
        {listRestaurant?.map((item) => {
          return (
            <Link href={`/nha-hang/${item.restaurant_slug}`} className='px-1 w-full h-auto !mr-0' key={item._id}>
              <Image
                src={item.restaurant_banner.image_cloud}
                width={589}
                height={353}
                alt='vuducbo'
                className='object-cover w-full h-[300px] rounded-xl'
              />
              <div className='flex flex-col'>
                <span className='font-bold text-lg line-clamp-2 hover:text-red-500 cursor-pointer'>
                  {item.restaurant_name}
                </span>
                <span className='font-semibold text-red-500 text-sm'>
                  {item.restaurant_price.restaurant_price_option === 'range'
                    ? `Từ ${item.restaurant_price.restaurant_price_min?.toLocaleString()} - ${item.restaurant_price.restaurant_price_max?.toLocaleString()} VNĐ`
                    : item.restaurant_price.restaurant_price_option === 'down'
                    ? `Dưới ${item.restaurant_price.restaurant_price_amount?.toLocaleString()} VNĐ`
                    : item.restaurant_price.restaurant_price_option === 'up'
                    ? `Trên ${item.restaurant_price.restaurant_price_amount?.toLocaleString()} VNĐ`
                    : ''}
                </span>
              </div>
            </Link>
          )
        })}

        {/* ))} */}
      </Slider>
    </div>
  )
}
