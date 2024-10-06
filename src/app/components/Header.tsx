import { Button, Popover } from 'antd'
import Image from 'next/image'
import { FaAngleDown, FaUser } from 'react-icons/fa6'
import AccountHeader from './AccountHeader'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='bg-white h-12 shadow px-[115px] flex justify-between'>
      <div className='flex'>
        <Link href={'/'}>
          <Image src={'/image/logo_passgo.png'} alt='vuducbo' width={100} height={100} className='w-auto h-[45px]' />
        </Link>
        <div className='flex mt-4 ml-5'>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500'>
            Gần bạn
          </span>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500'>
            Bộ sưu tập
          </span>
          <Popover content={diningContent} trigger='hover'>
            <span className='font-semibold text-sm px-2 flex cursor-pointer hover:border-b-2 hover:border-red-500'>
              Ăn uống
              <FaAngleDown fontSize={'0.9em'} className='mt-1' />
            </span>
          </Popover>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500'>
            Nhà hàng uy tín
          </span>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500'>
            Ưu đãi hot
          </span>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500'>
            Mới nhất
          </span>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500 flex'>
            Tin tức & blog
            <FaAngleDown fontSize={'0.9em'} className='mt-1' />
          </span>
          <span className='font-semibold text-sm px-2 cursor-pointer hover:border-b-2 hover:border-red-500 flex'>
            Video PasGo
            <FaAngleDown fontSize={'0.9em'} className='mt-1' />
          </span>
        </div>
      </div>
      <AccountHeader />
    </header>
  )
}

const diningContent = (
  <div className='flex flex-col'>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Nhà hàng
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Lẩu
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Buffet
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Hải sản
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Lẩu & nướng
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Quán nhậu
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Món chay
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Đặt tiệc
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Hàn Quốc
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Nhật Bản
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Món Âu
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Món Việt
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Món Thái
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Món Trung Hoa
    </span>
    <span className='font-semibold h-8 flex items-end w-32 text-sm px-2 cursor-pointer border-b-[1px] border-[#ccc] hover:border-b-2 hover:border-red-500'>
      Tiệc cưới
    </span>
  </div>
)
