'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { createBookTable, getRestaurantBySlug, IRestaurantBySlug } from '../nha-hang/api'
import { Toast } from '../components/Notification'
import { useLoading } from '../context/LoadingContext'
import {
  dayOfWeekMap,
  disabledDate,
  getNextTime,
  getTimeObject,
  HuorLBVl,
  IHour
} from '../nha-hang/_component/FormBookTable'
import dayjs from 'dayjs'
import { Hour } from '../dashboard/restaurant/_component/Default.data'
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Row, Select } from 'antd'
import { FaCalendarAlt, FaRegUser } from 'react-icons/fa'
import { MdChildCare } from 'react-icons/md'
import 'dayjs/locale/vi' // Import ngôn ngữ tiếng Việt cho dayjs
import localeData from 'dayjs/plugin/localeData'
import { FormatDayOfWeek, isNumericString } from '@/app/utils'
import { LuClock4 } from 'react-icons/lu'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'

// Cài đặt localeData plugin để lấy thông tin thứ
dayjs.extend(localeData)
dayjs.locale('vi')

export interface FieldForm {
  number_adults: number
  number_children: number
  arrival_date: Date
  arrival_time: number | HuorLBVl
  book_tb_email: string
  book_tb_phone: string
  book_tb_name: string
  book_tb_note: string
}

const findTimeObject = (value: any) => {
  return Hour.find((t) => t.value === value) || { label: '', value }
}

export default function DatChoNgayPage() {
  const [form] = Form.useForm()
  const searchParams = useSearchParams()
  const { setLoading } = useLoading()
  const inforUser = useSelector((state: RootState) => state.inforUser)
  const [restaurant, setRestaurant] = useState<IRestaurantBySlug>()
  const slug = searchParams.get('slug')
  const book_tb_date = searchParams.get('book_tb_date')
  const book_tb_hour = {
    label: searchParams.get('book_tb_hour_label'),
    value: searchParams.get('book_tb_hour_value')
  }
  const book_tb_number_adults = searchParams.get('book_tb_number_adults')
  const book_tb_number_children = searchParams.get('book_tb_number_children')

  const timeNow = getNextTime(dayjs())
  const [checkDate, setcheckDate] = useState(dayjs())

  const getObjectByDayOfWeek = (dayOfWeek: any) => {
    // Tìm số thứ tự của ngày
    const dayNumber = dayOfWeekMap[dayOfWeek]

    // Tìm đối tượng trong mảng dữ liệu dựa trên số thứ tự
    const result = restaurant?.restaurant_hours.find((item: any) => dayOfWeekMap[item.day_of_week] === dayNumber)

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
    if (slug) {
      getRestaurant(slug)
    }
  }, [slug])

  useEffect(() => {
    form.setFieldsValue({
      book_tb_email: inforUser?.us_email || '', // Sử dụng optional chaining để tránh lỗi undefined
      book_tb_phone: inforUser?.us_phone || '',
      book_tb_name: inforUser?.us_name || ''
    })
  }, [inforUser, form])

  const onFinish: FormProps<FieldForm>['onFinish'] = async (values) => {
    setLoading(true)
    const arrivalDate = values.arrival_date
    const dayOfWeek = arrivalDate ? dayjs(arrivalDate).format('dddd') : null
    const validDays = restaurant?.restaurant_hours.map((item) => item.day_of_week)
    const formatDayOfWeek = FormatDayOfWeek(dayOfWeek as string)
    if (!validDays?.includes(formatDayOfWeek)) {
      Toast('Lỗi', 'Nhà hàng không mở cửa vào ngày này', 'error')
      return
    }
    const objectForDay: any = getObjectByDayOfWeek(formatDayOfWeek)
    if (
      +values.arrival_time < (objectForDay as any)?.open?.value ||
      +values.arrival_time > (objectForDay as any)?.close?.value
    ) {
      Toast(
        'Lỗi',
        `${objectForDay?.day_of_week} nhà hàng này chỉ mở cửa từ ${objectForDay?.open.label} đến ${objectForDay?.close.label}`,
        'error'
      )
      return
    }
    values.arrival_time = getTimeObject(+values.arrival_time) as HuorLBVl

    if (!isNumericString(values.book_tb_phone)) {
      Toast('Lỗi', 'Số điện thoại không hợp lệ', 'error')
      return
    }

    const book_tb_hour_value = book_tb_hour?.value ?? '' // Giá trị mặc định là rỗng nếu null
    const book_tb_hour_label = book_tb_hour?.label ?? '' // Giá trị mặc định là rỗng nếu null

    const payload = {
      book_tb_restaurant_id: restaurant?._id,
      book_tb_email: values.book_tb_email,
      book_tb_phone: values.book_tb_phone,
      book_tb_name: values.book_tb_name,
      book_tb_date: values.arrival_date,
      book_tb_hour: values.arrival_time
        ? values.arrival_time
        : { value: +book_tb_hour_value, label: book_tb_hour_label },
      book_tb_number_adults: +values.number_adults,
      book_tb_number_children: +values.number_children,
      book_tb_note: values.book_tb_note,
      book_tb_redirect_url: `${process.env.NEXT_PUBLIC_URL_CLIENT}/confirm-book-table`
    }

    try {
      const res = await createBookTable(payload)
      if (res.statusCode === 201) {
        Toast('Thành công', 'Đặt chỗ thành công, vui lòng kiểm tra email để xác nhận đặt chỗ', 'success')
      }
      if (res.statusCode === 400) {
        if (Array.isArray(res.message)) {
          res.message.map((item: string) => {
            Toast('Lỗi', item, 'warning')
          })
        } else {
          Toast('Lỗi', res.message, 'warning')
        }
      }
      if (res.statusCode === 404) {
        Toast('Lỗi', res.message, 'error')
      }
    } catch (error) {
      Toast('Lỗi', 'Đã có lỗi xảy ra vui lòng thử lại sau ít phút', 'error')
    } finally {
      setLoading(false)
    }

    // Toast('Thành công', res.message, 'success')
  }
  return (
    <div className='ml-1 w-full bg-[#f2f2f7] px-32 py-10'>
      <div className='bg-white my-8 py-6 rounded-lg pl-10 -mx-2'>
        <span className='uppercase font-semibold text-lg'>Đặt chỗ đến "{restaurant?.restaurant_name}"</span>
      </div>

      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'
        initialValues={{
          arrival_date: dayjs(book_tb_date),
          arrival_time: book_tb_hour,
          number_adults: book_tb_number_adults,
          number_children: book_tb_number_children
        }}
        className='flex gap-3 justify-center'
      >
        <Col span={15} className='bg-white h-auto p-10 rounded-lg'>
          <Form.Item<FieldForm>
            label='Tên khách hàng'
            name='book_tb_name'
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input allowClear maxLength={50} showCount disabled={inforUser.us_name ? true : false} />
          </Form.Item>

          <div className='flex gap-5'>
            <Form.Item<FieldForm>
              label='Email'
              name='book_tb_email'
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                {
                  type: 'email',
                  message: 'Email không đúng định dạng'
                }
              ]}
              className='w-full'
            >
              <Input allowClear maxLength={50} showCount disabled={inforUser.us_email ? true : false} />
            </Form.Item>
            <Form.Item<FieldForm>
              label='Số điện thoại'
              name='book_tb_phone'
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              className='w-full'
            >
              <Input allowClear maxLength={10} showCount disabled={inforUser.us_phone ? true : false} />
            </Form.Item>
          </div>

          <Form.Item<FieldForm> label='Ghi chú' name='book_tb_note'>
            <Input.TextArea allowClear maxLength={150} showCount />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Col>

        <Col span={9} className='bg-white p-10 rounded-lg h-[225px]'>
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
        </Col>
      </Form>
    </div>
  )
}
