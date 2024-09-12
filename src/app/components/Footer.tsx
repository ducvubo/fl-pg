import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-white text-gray-600 py-8 border-t'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* PasGo Introduction */}
        <div>
          <h2 className='text-red-500 font-bold text-xl mb-4'>PasGo</h2>
          <p>
            PasGo là Mạng lưới nhà hàng NGON, uy tín và chất lượng. Giúp thực khách đặt bàn dễ dàng, được tặng kèm ưu
            đãi mà không cần mua Deal, Voucher. Giải pháp đột phá mới cho câu chuyện ăn gì, ở đâu!
          </p>
        </div>

        {/* Về PasGo */}
        <div>
          <h2 className='font-semibold text-lg mb-4'>Về PasGo</h2>
          <ul>
            <li className='mb-2'>Những điều thú vị về App PasGo - Có thể bạn chưa biết!</li>
            <li className='mb-2'>Vì sao PasGo đang phát triển!</li>
            <li className='mb-2'>Hướng dẫn đặt bàn</li>
            <li className='mb-2'>Chính sách bảo mật</li>
          </ul>
        </div>

        {/* Interaction Links */}
        <div>
          <h2 className='font-semibold text-lg mb-4'>Tương tác</h2>
          <ul>
            <li className='mb-2'>Khiếu nại</li>
            <li className='mb-2'>Câu hỏi thường gặp</li>
            <li className='mb-2'>Dành cho nhà hàng</li>
            <li className='mb-2'>Tin tức</li>
            <li className='mb-2'>Liên hệ</li>
            <li className='mb-2'>Địa điểm gần bạn</li>
          </ul>
        </div>

        {/* Social Media and Contact */}
        <div className='flex flex-col items-start'>
          <h2 className='font-semibold text-lg mb-4'>Tham gia với chúng tôi</h2>
          <div className='flex space-x-4 mb-4'>
            <a href='#' className='text-red-500'>
              <i className='fab fa-facebook fa-2x'></i>
            </a>
            <a href='#' className='text-red-500'>
              <i className='fab fa-youtube fa-2x'></i>
            </a>
            <a href='#' className='text-red-500'>
              <i className='fab fa-tiktok fa-2x'></i>
            </a>
          </div>
          <div className='mt-2'>
            <img src='path-to-your-badge.png' alt='Registered Badge' className='w-16 mb-4' />
            <button className='bg-red-500 text-white px-4 py-2 rounded-full'>Gửi góp ý</button>
          </div>
        </div>
      </div>

      {/* Footer bottom section */}
      <div className='text-center text-sm mt-8 border-t pt-4'>
        <p>© COPYRIGHT 2010 PASGO.JSC, ALL RIGHTS RESERVED</p>
        <p className='mt-2'>CÔNG TY CỔ PHẦN PASGO</p>
        <p>Văn phòng Hà Nội: Tầng 2 tòa nhà VTC Online, Số 18 Tam Trinh, Q. Hai Bà Trưng, Hà Nội</p>
        <p>Văn Phòng TP.HCM: Lầu 13, Tòa nhà M-H, Số 728-730 Võ Văn Kiệt, P.1, Quận 5, TP Hồ Chí Minh</p>
        <p className='mt-2'>Tổng đài: 1900 6005 | Email: CSKH@pasgo.vn</p>
        <p className='mt-2'>Mã số doanh nghiệp: 0106329034 do Sở Kế hoạch đầu tư TP Hà Nội cấp ngày 08/10/2013</p>
      </div>
    </footer>
  )
}

export default Footer
