'use client'
import { Carousel, Col, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ImageNext from 'next/image'
import { Image as ImageAntd } from 'antd'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { TbFlag3 } from 'react-icons/tb'
import { IoLogoUsd } from 'react-icons/io'
import { FaRegClock } from 'react-icons/fa6'
import FormBookTable from '../_component/FormBookTable'
import { getRestaurantBySlug, IRestaurantBySlug } from '../api'
import { Toast } from '@/app/components/Notification'
import { useLoading } from '@/app/context/LoadingContext'
import { Hour } from '@/app/dashboard/restaurant/_component/Default.data'
const NextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div className={className} style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} onClick={onClick} />
  )
}

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return <div className={className} style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} onClick={onClick} />
}
const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1, // Hiển thị 5 item trên 1 màn hình
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <NextArrow className='bg-black' />, // Custom next button
  prevArrow: <PrevArrow className='bg-black' />
}

const findTimeObject = (value: any) => {
  return Hour.find((t) => t.value === value) || { label: '', value }
}
export default function ThongTinNhaHang({ params }: { params: { slug: string } }) {
  const { setLoading } = useLoading()
  const [restaurant, setRestaurant] = useState<IRestaurantBySlug>()
  const getRestaurant = async (slug: string) => {
    setLoading(true)
    try {
      const res: IBackendRes<IRestaurantBySlug> = await getRestaurantBySlug(slug)
      if (res.statusCode === 200 && res.data) {
        res.data.restaurant_hours.forEach((hour: any) => {
          hour.open = findTimeObject(hour.open)
          hour.close = findTimeObject(hour.close)
        })
        setRestaurant(res.data)
      } else {
        Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút', 'error')
      }
    } catch (error) {
      Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút', 'error')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getRestaurant(params.slug)
  }, [params.slug])

  console.log(restaurant)
  return (
    <section className='bg-[#eeeeee] px-32 py-10'>
      <Row className='flex gap-5'>
        <Col span={16} className='h-[402px]'>
          {restaurant?.restaurant_image?.length === 1 ? (
            <ImageNext
              src={restaurant?.restaurant_image[0].image_cloud}
              width={1000}
              height={1000}
              alt='vuducbo'
              className='h-[402px] object-cover rounded-xl'
            />
          ) : (
            <Slider {...settings}>
              {restaurant?.restaurant_image?.map((item, index) => (
                <ImageNext
                  key={index}
                  src={item.image_cloud}
                  width={1000}
                  height={1000}
                  alt='vuducbo'
                  className='h-[402px] object-cover rounded-xl bg-no-repeat'
                />
              ))}
            </Slider>
          )}
        </Col>
        <Col span={7} className=' rounded-xl overflow-y-auto max-h-[404px]'>
          <Row gutter={[6, 0]} className='h-full w-[355px]'>
            {restaurant?.restaurant_image?.map((item, index) => (
              <Col span={12} className='!-mb-5 h-[157px] w-[175px]' key={index}>
                <ImageAntd src={item.image_cloud} className='!w-[175px] object-cover !h-32 rounded-lg' />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row className='flex gap-5 mt-7'>
        <Col span={16}>
          <Row className='h-[201px] bg-white rounded-lg '>
            <div className='flex flex-col mt-4 ml-6 gap-2'>
              <span className='font-semibold text-3xl'>{restaurant?.restaurant_name}</span>
              <div className='flex gap-2'>
                <HiOutlineLocationMarker fontSize={'1.4em'} className=' mt-[3px]' />{' '}
                <span className='font-semibold text-base'>{restaurant?.restaurant_address.address_specific}</span>
              </div>
              <div className='flex gap-2'>
                <TbFlag3 fontSize={'1.4em'} className=' mt-[3px]' />
                <span className='font-semibold text-base'>Loại hình:</span>
                {restaurant?.restaurant_type?.slice(0, 3).map((item: any, index: number) => (
                  <span key={index} className='font-semibold text-base text-[#d02028]'>
                    {item.restaurant_type_name}
                    {index !== Math.min(restaurant?.restaurant_type?.length || 0, 3) - 1 && ', '}
                  </span>
                ))}

                {(restaurant?.restaurant_type?.length || 0) > 3 && (
                  <span className='font-semibold text-base text-[#d02028]'>...</span>
                )}
              </div>
              <div className='flex gap-2'>
                <IoLogoUsd fontSize={'1.3em'} className=' rounded-full border-[black] border-[2px] mt-[3px]' />
                <span className='font-semibold text-base flex'>
                  Khoảng giá <IoLogoUsd className='mt-[5px] ml-1' fontSize={'0.9em'} color='#ff9500' />
                  <IoLogoUsd className='mt-[5px]' fontSize={'0.9em'} color='#ff9500' />
                  <IoLogoUsd className='mt-[5px]' fontSize={'0.9em'} color='#aaaaaa' />
                  <IoLogoUsd className='mt-[5px]' fontSize={'0.9em'} color='#aaaaaa' />
                  <IoLogoUsd className='mt-[5px]' fontSize={'0.9em'} color='#aaaaaa' /> :
                </span>
                <span className='font-semibold text-base'>
                  {restaurant?.restaurant_price.restaurant_price_option === 'range'
                    ? `Từ ${restaurant?.restaurant_price.restaurant_price_min?.toLocaleString()} - ${restaurant?.restaurant_price.restaurant_price_max?.toLocaleString()} đ/người`
                    : restaurant?.restaurant_price.restaurant_price_option === 'down'
                    ? `Dưới ${restaurant?.restaurant_price.restaurant_price_amount?.toLocaleString()} đ/người`
                    : restaurant?.restaurant_price.restaurant_price_option === 'up'
                    ? `Trên ${restaurant?.restaurant_price.restaurant_price_amount?.toLocaleString()} đ/người`
                    : ''}
                </span>
              </div>
              <div className='flex gap-2'>
                <FaRegClock fontSize={'1.3em'} className=' mt-[3px]' />
                <span className='font-semibold text-base text-[#d02028]'>Đang mở cửa: 10:30 - 14:00</span>
              </div>
            </div>
          </Row>
          <Row className='bg-white h-96 mt-10 rounded-lg'>
            <div className='mt-4 ml-4'>
              <span className='font-semibold text-2xl'>Giờ hoạt động</span>
              <div className='mt-6 flex flex-col gap-3'>
                {restaurant?.restaurant_hours.map((hour: any, index) => (
                  <div className='flex gap-[320px]' key={index}>
                    <span className='font-semibold text-lg'>{hour.day_of_week}</span>
                    <span className='font-semibold text-lg'>
                      {hour.open.label} - {hour.close.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Row>
        </Col>
        <Col span={7} className=' rounded-xl bg-white h-96'>
          <Row className='flex justify-center mt-2'>
            <span className='font-semibold text-lg'>Đặt chỗ</span>{' '}
            <span className='font-medium mt-[5px] ml-1'>(Để có chỗ trước khi đến)</span>
          </Row>
          <Row>
            <FormBookTable
              restaurant_hours={restaurant?.restaurant_hours as any}
              _id={restaurant?._id}
              slug={params.slug}
            />
          </Row>
        </Col>
      </Row>
    </section>
  )
}
