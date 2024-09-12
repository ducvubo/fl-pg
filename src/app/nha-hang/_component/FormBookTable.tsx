import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { FaRegUser } from 'react-icons/fa6'
import { MdChildCare } from 'react-icons/md'
import { FaCalendarAlt } from 'react-icons/fa'
import { LuClock4 } from 'react-icons/lu'
import dayjs from 'dayjs'
import 'dayjs/locale/vi' // Import ngôn ngữ tiếng Việt cho dayjs
import locale from 'antd/es/date-picker/locale/vi_VN'
import { Hour } from '@/app/dashboard/restaurant/_component/Default.data'

const disabledDate = (current: any) => {
  return current && current < dayjs().startOf('day')
}

const getNextTime = (currentTime: any) => {
  // Chuyển đổi giờ hiện tại thành định dạng 24h (HH:mm)
  const currentHour = currentTime.hour()
  const currentMinute = currentTime.minute()

  // Tìm giờ tiếp theo
  for (const time of Hour) {
    const [hour, minute] = time.label.split(':').map(Number)
    if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
      return time
    }
  }

  // Nếu không tìm thấy giờ tiếp theo (trường hợp hiện tại là giờ cuối cùng trong mảng)
  return Hour[0] // Quay lại giờ đầu tiên trong mảng
}
export default function FormBookTable() {
  const timeNow = getNextTime(dayjs())

  return (
    <div className='ml-2 mt-6 w-full'>
      <Form layout='vertical'>
        <Row className='w-full flex gap-2'>
          <Col span={12}>
            <Form.Item
              className='w-full'
              label={
                <div className='flex gap-2'>
                  <FaRegUser fontSize={'1.3em'} />
                  <span className='font-medium'>Người lớn:</span>
                </div>
              }
            >
              <Select defaultValue={0}>
                {Array.from({ length: 200 }).map((_, index) => (
                  <Select.Option key={index} value={index}>
                    {index}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={11}>
            <Form.Item
              label={
                <div className='flex gap-2'>
                  <MdChildCare fontSize={'1.3em'} />
                  <span className='font-medium'>Trẻ em:</span>
                </div>
              }
              className='w-full'
            >
              <Select defaultValue={0}>
                {Array.from({ length: 200 }).map((_, index) => (
                  <Select.Option key={index} value={index}>
                    {index}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className='w-full flex gap-2'>
          <Col span={12}>
            <Form.Item
              className='w-full'
              label={
                <div className='flex gap-2'>
                  <FaCalendarAlt fontSize={'1.3em'} />
                  <span className='font-medium'>Ngày đến:</span>
                </div>
              }
            >
              <DatePicker
                className='w-full'
                allowClear={false}
                defaultValue={dayjs()} // Ngày mặc định là hôm nay
                disabledDate={disabledDate} // Không cho phép chọn ngày trước hôm nay
                locale={locale} // Hiển thị ngày tháng theo tiếng Việt
                format='DD/MM/YYYY'
              />
            </Form.Item>
          </Col>

          <Col span={11}>
            <Form.Item
              label={
                <div className='flex gap-2'>
                  <LuClock4 fontSize={'1.3em'} />
                  <span className='font-medium'>Giờ đến:</span>
                </div>
              }
              className='w-full'
            >
              <Select defaultValue={timeNow.value}>
                {Hour?.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item.value}>
                      {item.label}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
