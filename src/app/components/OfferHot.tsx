'use client'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import { getRestaurant, IRestaurantHome } from '../actions/home'
import { Toast } from './Notification'
import Link from 'next/link'

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

export default function OfferHot() {
  const [listRestaurant, setListRestaurant] = useState<IRestaurantHome[]>([])

  const listRestaurants = async () => {
    try {
      const res: IBackendRes<IRestaurantHome[]> = await getRestaurant()
      console.log(res)
      if (res.statusCode === 200 && res.data) {
        setListRestaurant(res.data)
      } else {
        Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút', 'error')
      }
    } catch (error) {
      Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút', 'error')
    }
  }
  useEffect(() => {
    listRestaurants()
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4.5, // Hiển thị 5 item trên 1 màn hình
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />, // Custom next button
    prevArrow: <PrevArrow />
  }
  return (
    <section className='mt-7 flex flex-col mb-16'>
      <span className='font-bold text-3xl'>Ưu Đãi Hot</span>
      <span className='font-medium my-3'>Danh sách nhà hàng có ưu đãi HOT khi đặt bàn qua PasGo. Đặt ngay!</span>
      <Slider {...settings}>
        {/* {Array.from({ length: 20 }).map((_, index) => ( */}
        {listRestaurant?.map((restaurant, index) => {
          return (
            <Link href={`/nha-hang/${restaurant.restaurant_slug}`}>
              <div key={index} className='group w-64 h-[370px] -ml-32'>
                <div className='mx-1 flex flex-col cursor-pointer relative'>
                  <Image
                    src={restaurant.restaurant_banner.image_cloud}
                    width={500}
                    height={500}
                    alt='vuducbo'
                    className='w-[243px] h-[260px] rounded-md group-hover:opacity-80 '
                  />
                  <div className='font-medium text-white bg-[#d02028] w-[102px] h-5 flex justify-center items-center rounded-md text-sm px-2 absolute'>
                    Được đề xuất
                  </div>
                  <span className='font-semibold text-[17px] group-hover:text-[#d02028]'>
                    {restaurant.restaurant_name}
                  </span>
                  <span className='font-semibold text-[15px] text-[#d02028]'>
                    {' '}
                    {restaurant.restaurant_price.restaurant_price_option === 'range'
                      ? `Từ ${restaurant.restaurant_price.restaurant_price_min?.toLocaleString()} - ${restaurant.restaurant_price.restaurant_price_max?.toLocaleString()} VNĐ`
                      : restaurant.restaurant_price.restaurant_price_option === 'down'
                      ? `Dưới ${restaurant.restaurant_price.restaurant_price_amount?.toLocaleString()} VNĐ`
                      : restaurant.restaurant_price.restaurant_price_option === 'up'
                      ? `Trên ${restaurant.restaurant_price.restaurant_price_amount?.toLocaleString()} VNĐ`
                      : ''}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}

        {/* ))} */}
      </Slider>
    </section>
  )
}
