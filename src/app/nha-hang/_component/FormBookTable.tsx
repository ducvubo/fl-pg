import { Button, Col, DatePicker, Form, FormProps, Input, Row, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { FaRegUser } from 'react-icons/fa6'
import { MdChildCare } from 'react-icons/md'
import { FaCalendarAlt } from 'react-icons/fa'
import { LuClock4 } from 'react-icons/lu'
import dayjs from 'dayjs'
import 'dayjs/locale/vi' // Import ngôn ngữ tiếng Việt cho dayjs
import locale from 'antd/es/date-picker/locale/vi_VN'
import { Hour } from '@/app/dashboard/restaurant/_component/Default.data'
import localeData from 'dayjs/plugin/localeData'
import { FormatDayOfWeek } from '@/app/utils'
import { Toast } from '@/app/components/Notification'

// Cài đặt localeData plugin để lấy thông tin thứ
dayjs.extend(localeData)
dayjs.locale('vi')
interface IHour {
  day_of_week: string
  open: HuorLBVl
  close: HuorLBVl
}
export interface HuorLBVl {
  label: string
  value: number
}

interface FieldForm {
  number_adults: number
  number_children: number
  arrival_date: Date
  arrival_time: number | HuorLBVl
}

interface Props {
  restaurant_hours: IHour[]
}

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

const dayOfWeekMap: { [key: string]: number } = {
  'Chủ Nhật': 0,
  'Thứ Hai': 1,
  'Thứ Ba': 2,
  'Thứ Tư': 3,
  'Thứ Năm': 4,
  'Thứ Sáu': 5,
  'Thứ Bảy': 6
}

const getTimeObject = (value: number): HuorLBVl | null => {
  // Find the time object with the matching value
  const timeObject = Hour.find((item) => item.value === value)

  // Return the time object or null if not found
  return timeObject || null
}

export default function FormBookTable({ restaurant_hours }: Props) {
  const timeNow = getNextTime(dayjs())
  const [checkDate, setcheckDate] = useState(dayjs())

  const getObjectByDayOfWeek = (dayOfWeek: any) => {
    // Tìm số thứ tự của ngày
    const dayNumber = dayOfWeekMap[dayOfWeek]

    // Tìm đối tượng trong mảng dữ liệu dựa trên số thứ tự
    const result = restaurant_hours.find((item) => dayOfWeekMap[item.day_of_week] === dayNumber)

    return result
  }

  const hoursToDisplay = useMemo(() => {
    const now = dayjs()
    const currentHour = now.hour()
    const currentMinute = now.minute()

    if (dayjs().isSame(checkDate, 'day')) {
      return Hour.filter((item) => {
        const [hour, minute] = item.label.split(':').map(Number)
        return hour > currentHour || (hour === currentHour && minute > currentMinute)
      })
    }
    return Hour
  }, [checkDate])

  const onFinish: FormProps<FieldForm>['onFinish'] = (values) => {
    const arrivalDate = values.arrival_date
    const dayOfWeek = arrivalDate ? dayjs(arrivalDate).format('dddd') : null
    const validDays = restaurant_hours.map((item) => item.day_of_week)
    const formatDayOfWeek = FormatDayOfWeek(dayOfWeek as string)
    if (!validDays.includes(formatDayOfWeek)) {
      Toast('Lỗi', 'Nhà hàng không mở cửa vào ngày này', 'error')
      return
    }
    const objectForDay = getObjectByDayOfWeek(formatDayOfWeek)

    if (
      +values.arrival_time < (objectForDay as IHour)?.open?.value ||
      +values.arrival_time > (objectForDay as IHour)?.close?.value
    ) {
      Toast(
        'Lỗi',
        `${objectForDay?.day_of_week} nhà hàng này chỉ mở cửa từ ${objectForDay?.open.label} đến ${objectForDay?.close.label}`,
        'error'
      )
      return
    }
    console.log(objectForDay)

    values.arrival_time = getTimeObject(+values.arrival_time) as HuorLBVl

    console.log('Success:', values)
  }

  return (
    <div className='ml-2 mt-6 w-full'>
      <Form
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'
        initialValues={{
          arrival_date: dayjs(),
          arrival_time: timeNow.value,
          number_adults: 2,
          number_children: 0
        }}
      >
        <Row className='w-full flex gap-2'>
          <Col span={12}>
            <Form.Item<FieldForm>
              className='w-full'
              name='number_adults'
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
            <Form.Item<FieldForm>
              name='number_children'
              label={
                <div className='flex gap-2'>
                  <MdChildCare fontSize={'1.3em'} />
                  <span className='font-medium'>
                    Trẻ em: <span className='font-normal'>(dưới 10 tuổi)</span>{' '}
                  </span>
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
            <Form.Item<FieldForm>
              className='w-full'
              name='arrival_date'
              label={
                <div className='flex gap-2'>
                  <FaCalendarAlt fontSize={'1.3em'} />
                  <span className='font-medium'>Ngày đến:</span>
                </div>
              }
            >
              <DatePicker
                onChange={setcheckDate}
                className='w-full'
                allowClear={false}
                // defaultValue={dayjs()} // Ngày mặc định là hôm nay
                disabledDate={disabledDate} // Không cho phép chọn ngày trước hôm nay
                locale={locale}
                // locale={{ lang: { locale: 'vi' } }} // Hiển thị ngày tháng theo tiếng Việt
                format='DD/MM/YYYY'
              />
            </Form.Item>
          </Col>

          <Col span={11}>
            <Form.Item<FieldForm>
              name='arrival_time'
              label={
                <div className='flex gap-2'>
                  <LuClock4 fontSize={'1.3em'} />
                  <span className='font-medium'>Giờ đến:</span>
                </div>
              }
              className='w-full'
            >
              <Select>
                {hoursToDisplay.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
