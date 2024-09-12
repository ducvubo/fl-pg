'use client'
import { Carousel, Col, Row, Select } from 'antd'
import React from 'react'
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

export default function ThongTinNhaHang() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Hiển thị 5 item trên 1 màn hình
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />, // Custom next button
    prevArrow: <PrevArrow />
  }
  return (
    <section className='bg-[#eeeeee] px-32 py-10'>
      <Row className='flex gap-5'>
        <Col span={16} className='h-[402px]'>
          <Slider {...settings}>
            {Array.from({ length: 8 }).map((_, index) => (
              <ImageNext
                key={index}
                src={'/image/restaurant.webp'}
                width={1000}
                height={1000}
                alt='vuducbo'
                className='h-[402px] object-cover rounded-xl'
              />
            ))}
          </Slider>
        </Col>
        <Col span={7} className=' rounded-xl overflow-y-auto max-h-[404px]'>
          <Row gutter={[6, 0]} className='h-full w-[355px]'>
            {Array.from({ length: 6 }).map((_, index) => (
              <Col span={12} className='!-mb-5 h-[157px]' key={index}>
                <ImageAntd src='/image/restaurant.webp' className='w-full object-cover !h-32 rounded-lg' />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row className='flex gap-5 mt-7'>
        <Col span={16} className='h-[201px] bg-white rounded-lg '>
          <div className='flex flex-col mt-4 ml-6 gap-2'>
            <span className='font-semibold text-3xl'>Steam Box - Nguyễn Thị Định</span>
            <div className='flex gap-2'>
              <HiOutlineLocationMarker fontSize={'1.4em'} className=' mt-[3px]' />{' '}
              <span className='font-semibold text-base'>Số 25 Nguyễn Thị Định, Q. Cầu Giấy</span>
            </div>
            <div className='flex gap-2'>
              <TbFlag3 fontSize={'1.4em'} className=' mt-[3px]' />
              <span className='font-semibold text-base'>Loại hình:</span>
              <span className='font-semibold text-base text-red-500'>Gọi món lẩu hơi</span>
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
              <span className='font-semibold text-base'>180.000 - 300.000 đ/người</span>
            </div>
            <div className='flex gap-2'>
              <FaRegClock fontSize={'1.3em'} className=' mt-[3px]' />
              <span className='font-semibold text-base text-red-500'>Đang mở cửa: 10:30 - 14:00</span>
            </div>
          </div>
        </Col>
        <Col span={7} className=' rounded-xl bg-white h-96'>
          <Row className='flex justify-center mt-2'>
            <span className='font-semibold text-lg'>Đặt chỗ</span>{' '}
            <span className='font-medium mt-[5px] ml-1'>(Để có chỗ trước khi đến)</span>
          </Row>
          <Row>
            <FormBookTable />
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={16} className='bg-white h-96'>
        </Col>
      </Row>
    </section>
  )
}
