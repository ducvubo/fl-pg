'use client'
import React, { lazy, useEffect, useState } from 'react'
import type { FormProps, GetProp, UploadFile, UploadProps } from 'antd'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Image,
  Cascader,
  Space,
  DatePicker,
  TimePicker
} from 'antd'
import { ICategory } from '../../category/category.interface'
import { getAllCategory } from '../../category/category.api'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IAmenity, IRestaurant, IRestaurantAddress, IRestaurantPropose, IRestaurantType } from '../restaurant.interface'
import { dataAdress, dataProvince } from '@/address.data'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Tag from './Tag'
import { createRestaurant } from '../restaurant.api'

const mdParser = new MarkdownIt()
const { Option } = Select

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const normFile = (e: any) => {
  console.log(e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const dayOfWeek = [
  { value: 'Thứ Hai', label: 'Thứ Hai' },
  { value: 'Thứ Ba', label: 'Thứ Ba' },
  { value: 'Thứ Tư', label: 'Thứ Tư' },
  { value: 'Thứ Năm', label: 'Thứ Năm' },
  { value: 'Thứ Sáu', label: 'Thứ Sáu' },
  { value: 'Thứ Bảy', label: 'Thứ Bảy' },
  { value: 'Chủ Nhật', label: 'Chủ Nhật' }
]

const Hour = [
  { label: '00:00', value: 1 },
  { label: '00:15', value: 2 },
  { label: '00:30', value: 3 },
  { label: '00:45', value: 4 },
  { label: '01:00', value: 5 },
  { label: '01:15', value: 6 },
  { label: '01:30', value: 7 },
  { label: '01:45', value: 8 },
  { label: '02:00', value: 9 },
  { label: '02:15', value: 10 },
  { label: '02:30', value: 11 },
  { label: '02:45', value: 12 },
  { label: '03:00', value: 13 },
  { label: '03:15', value: 14 },
  { label: '03:30', value: 15 },
  { label: '03:45', value: 16 },
  { label: '04:00', value: 17 },
  { label: '04:15', value: 18 },
  { label: '04:30', value: 19 },
  { label: '04:45', value: 20 },
  { label: '05:00', value: 21 },
  { label: '05:15', value: 22 },
  { label: '05:30', value: 23 },
  { label: '05:45', value: 24 },
  { label: '06:00', value: 25 },
  { label: '06:15', value: 26 },
  { label: '06:30', value: 27 },
  { label: '06:45', value: 28 },
  { label: '07:00', value: 29 },
  { label: '07:15', value: 30 },
  { label: '07:30', value: 31 },
  { label: '07:45', value: 32 },
  { label: '08:00', value: 33 },
  { label: '08:15', value: 34 },
  { label: '08:30', value: 35 },
  { label: '08:45', value: 36 },
  { label: '09:00', value: 37 },
  { label: '09:15', value: 38 },
  { label: '09:30', value: 39 },
  { label: '09:45', value: 40 },
  { label: '10:00', value: 41 },
  { label: '10:15', value: 42 },
  { label: '10:30', value: 43 },
  { label: '10:45', value: 44 },
  { label: '11:00', value: 45 },
  { label: '11:15', value: 46 },
  { label: '11:30', value: 47 },
  { label: '11:45', value: 48 },
  { label: '12:00', value: 49 },
  { label: '12:15', value: 50 },
  { label: '12:30', value: 51 },
  { label: '12:45', value: 52 },
  { label: '13:00', value: 53 },
  { label: '13:15', value: 54 },
  { label: '13:30', value: 55 },
  { label: '13:45', value: 56 },
  { label: '14:00', value: 57 },
  { label: '14:15', value: 58 },
  { label: '14:30', value: 59 },
  { label: '14:45', value: 60 },
  { label: '15:00', value: 61 },
  { label: '15:15', value: 62 },
  { label: '15:30', value: 63 },
  { label: '15:45', value: 64 },
  { label: '16:00', value: 65 },
  { label: '16:15', value: 66 },
  { label: '16:30', value: 67 },
  { label: '16:45', value: 68 },
  { label: '17:00', value: 69 },
  { label: '17:15', value: 70 },
  { label: '17:30', value: 71 },
  { label: '17:45', value: 72 },
  { label: '18:00', value: 73 },
  { label: '18:15', value: 74 },
  { label: '18:30', value: 75 },
  { label: '18:45', value: 76 },
  { label: '19:00', value: 77 },
  { label: '19:15', value: 78 },
  { label: '19:30', value: 79 },
  { label: '19:45', value: 80 },
  { label: '20:00', value: 81 },
  { label: '20:15', value: 82 },
  { label: '20:30', value: 83 },
  { label: '20:45', value: 84 },
  { label: '21:00', value: 85 },
  { label: '21:15', value: 86 },
  { label: '21:30', value: 87 },
  { label: '21:45', value: 88 },
  { label: '22:00', value: 89 },
  { label: '22:15', value: 90 },
  { label: '22:30', value: 91 },
  { label: '22:45', value: 92 },
  { label: '23:00', value: 93 },
  { label: '23:15', value: 94 },
  { label: '23:30', value: 95 },
  { label: '23:45', value: 96 },
  { label: '23:59', value: 97 }
]

export default function AddOrEdit() {
  const [form] = Form.useForm()
  const [listCategory, setlistCategory] = useState<ICategory[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imageBanner, setImageBanner] = useState<UploadFile[]>([])
  const [imageRestaurant, setImageRestaurant] = useState<UploadFile[]>([])

  const [restaurantType, setRestaurantType] = useState<{ name: string; _id: string }[]>([])

  const [amenity, setAmenity] = useState<{ name: string; _id: string }[]>([])

  const [restaurantPrice, setrestaurantPrice] = useState<'range' | 'up' | 'down'>('range')

  const [selectedDays, setSelectedDays] = useState([]) // State to track selected days

  const handleDayChange = (value: any, fieldName: any) => {
    setSelectedDays((prevSelectedDays: any) => {
      const updated = { ...prevSelectedDays, [fieldName]: value }
      return updated
    })
  }

  const handleRemove = (name: any) => {
    setSelectedDays((prevSelectedDays) => {
      const updated = { ...prevSelectedDays }
      delete updated[name]
      return updated
    })
  }

  const handleOnChangPrice = (value: 'range' | 'up' | 'down') => {
    setrestaurantPrice(value)
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setImageBanner(newFileList)

  const handleChangeImageRestaurant: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('object', newFileList)
    setImageRestaurant(newFileList)
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const CustomAddress = (dataAddress: any, values: any) => {
    const address = values.restaurant_address
    const address_province_district_ward = address.address_province_district_ward

    const restaurant_address = {
      address_province: { value: '', name: '' },
      address_district: { value: '', name: '' },
      address_ward: { value: '', name: '' },
      address_specific: address.address_specific
    }

    // Tìm thông tin cho tỉnh thành
    dataAddress.forEach((item1: any) => {
      if (item1.value === address_province_district_ward[0]) {
        restaurant_address.address_province.value = item1.value
        restaurant_address.address_province.name = item1.label // Sử dụng `label` để lấy tên

        // Tìm thông tin cho quận
        item1.children.forEach((item2: any) => {
          if (item2.value === address_province_district_ward[1]) {
            restaurant_address.address_district.value = item2.value
            restaurant_address.address_district.name = item2.label // Sử dụng `label` để lấy tên

            // Tìm thông tin cho phường
            item2.children.forEach((item3: any) => {
              if (item3.value === address_province_district_ward[2]) {
                restaurant_address.address_ward.value = item3.value
                restaurant_address.address_ward.name = item3.label // Sử dụng `label` để lấy tên
              }
            })
          }
        })
      }
    })

    return restaurant_address
  }

  const buildAddress = (dataAddress: any, address: any) => {
    const { address_province, address_district, address_ward } = address

    // Tìm tên cho tỉnh
    const province = dataAddress.find((item: any) => item.value === address_province.value)
    const provinceName = province ? province.name : ''

    // Tìm tên cho quận
    const district = province?.children.find((item: any) => item.value === address_district.value)
    const districtName = district ? district.name : ''

    // Tìm tên cho phường
    const ward = district?.children.find((item: any) => item.value === address_ward.value)
    const wardName = ward ? ward.name : ''

    return {
      address_province_district_ward: [address_province.value, address_district.value, address_ward.value],
      address_specific: address.address_specific
    }
  }

  useEffect(() => {
    const getListCategory = async () => {
      try {
        const res: IBackendRes<ICategory[]> = await getAllCategory()
        if (res?.statusCode === 200 && res.data) {
          setlistCategory(res?.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getListCategory()
    form.setFieldValue(['restaurant_price', 'restaurant_price_option'], restaurantPrice)
    // form.setFieldValue({
    //   restaurant_price: {
    //     restaurant_price_option: restaurantPrice
    //   }
    // })

    //  // Đặt giá trị vào form sau khi các thành phần đã được render
    //  const setInitialImage = async () => {
    //   const initialFile: UploadFile = {
    //     uid: '-1',
    //     name: 'banner.png',
    //     status: 'done',
    //     url: test,
    //     thumbUrl: test,
    //   }
    //   form.setFieldsValue({
    //     restaurant_banner: [initialFile]
    //   })
    //   setImageBanner([initialFile])
    // }

    // setInitialImage()
  }, [])

  useEffect(() => {
    if (imageBanner.length > 0) {
      const updatedBanner = imageBanner[0]?.response?.data
        ? imageBanner[0]?.response?.data?.image_local
          ? imageBanner[0]?.response?.data?.image_local
          : imageBanner[0]?.response?.data?.image_cloud
        : imageBanner[0]?.thumbUrl
      setImageBanner([
        {
          ...imageBanner[0],
          thumbUrl: updatedBanner
        }
      ])

      form.setFieldsValue({
        restaurant_banner: imageBanner[0]?.response?.data
      })
    }
  }, [imageBanner[0]?.response])

  useEffect(() => {
    if (imageBanner.length > 0) {
      // const updatedBanner = imageBanner[0]?.response?.data
      //   ? imageBanner[0]?.response?.data?.image_local
      //     ? imageBanner[0]?.response?.data?.image_local
      //     : imageBanner[0]?.response?.data?.image_cloud
      //   : imageBanner[0]?.thumbUrl
      // setImageRestaurant([
      //   {
      //     ...imageBanner[0],
      //     thumbUrl: updatedBanner
      //   }
      // ])

      form.setFieldsValue({
        restaurant_image: imageRestaurant.map((item) => {
          if (item.response?.statusCode === 201) return item.response?.data
          else return
        })
      })
    }
  }, [imageRestaurant])

  const onFinish: FormProps<IRestaurant>['onFinish'] = async (values) => {
    const restaurant_address: any = CustomAddress(dataAdress, values)

    const restaurant_propose: IRestaurantPropose = {
      propose_consultation_reservation: {
        text: values.restaurant_propose.propose_consultation_reservation.text,
        html: mdParser.render(values.restaurant_propose.propose_consultation_reservation.text)
      },
      propose_bundled_offer: {
        text: values.restaurant_propose.propose_bundled_offer.text,
        html: mdParser.render(values.restaurant_propose.propose_bundled_offer.text)
      },
      propose_note: {
        text: values.restaurant_propose.propose_note.text,
        html: mdParser.render(values.restaurant_propose.propose_note.text)
      }
    }

    const restaurant_regulation = {
      text: values.restaurant_regulation.text,
      html: mdParser.render(values.restaurant_regulation.text)
    }

    const restaurant_parking_area = {
      text: values.restaurant_parking_area.text,
      html: mdParser.render(values.restaurant_parking_area.text)
    }

    const restaurant_description = {
      text: values.restaurant_description.text,
      html: mdParser.render(values.restaurant_description.text)
    }

    const restaurant_amenity = amenity.map((item: any) => item._id)
    const restaurant_type = restaurantType.map((item: any) => item._id)

    const payload: IRestaurant = {
      ...values,
      restaurant_address,
      restaurant_propose,
      restaurant_regulation,
      restaurant_parking_area,
      restaurant_amenity,
      restaurant_description,
      restaurant_type
    }

    const res = await createRestaurant(payload)

    console.log(res)

    console.log('Success:', values)
  }n

  const onFinishFailed: FormProps<IRestaurant>['onFinishFailed'] = (errorInfo) => {
    const restaurant_address: any = CustomAddress(dataAdress, errorInfo.values)
    console.log(restaurant_address)
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      initialValues={{
        remember: true,
        restaurant_hours: [{}],
        restaurant_overview: {
          overview_suitable: [''],
          overview_specialty_dish: [''],
          overview_space: [''],
          overview_parking_area: [''],
          overview_characteristic: ['']
        }
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item<IRestaurant>
        label='Ảnh nhà hàng'
        getValueFromEvent={normFile}
        name='restaurant_image'
        rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
      >
        <Upload
          action={`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`}
          maxCount={10}
          listType='picture-card'
          fileList={imageRestaurant}
          onPreview={handlePreview}
          onChange={handleChangeImageRestaurant}
          headers={{ folder_type: 'restaurant_infor' }}
        >
          <PlusOutlined />
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage('')
            }}
            src={previewImage}
          />
        )}
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Ảnh bìa'
        getValueFromEvent={normFile}
        name='restaurant_banner'
        rules={[{ required: true, message: 'Vui lòng chọn banner!' }]}
      >
        <Upload
          action={`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`}
          maxCount={1}
          listType='picture-card'
          fileList={imageBanner}
          onPreview={handlePreview}
          onChange={handleChange}
          headers={{ folder_type: 'banner_restaurant' }}
        >
          {imageBanner.length >= 1 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage('')
            }}
            src={previewImage}
          />
        )}
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Email'
        name='restaurant_email'
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          {
            type: 'email',
            message: 'Email không đúng định dạng!'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Password'
        name='restaurant_password'
        rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Số điện thoại'
        name='restaurant_phone'
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Danh mục'
        name='restaurant_category'
        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
      >
        <Select
          options={listCategory.map((category) => ({
            label: category.category_name,
            value: category._id
          }))}
        />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Tên nhà hàng'
        name='restaurant_name'
        rules={[{ required: true, message: 'Vui lòng nhập tên nhà hàng!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label='Địa chỉ'>
        <Space.Compact className='flex flex-col'>
          <Form.Item
            name={['restaurant_address', 'address_province_district_ward']}
            noStyle
            rules={[{ required: true, message: 'Vui lòng chọn địa chỉ' }]}
            className='rounded-lg'
          >
            <Cascader options={dataAdress} placeholder='Chọn địa chỉ' />
          </Form.Item>
          <Form.Item
            name={['restaurant_address', 'address_specific']}
            noStyle
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input style={{ width: '100%' }} placeholder='Địa chỉ' className='round-lg' />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label='Khoảng giá'>
        <Space.Compact>
          <Form.Item
            name={['restaurant_price', 'restaurant_price_option']}
            noStyle
            rules={[{ required: true, message: 'Vui lòng chọn giá' }]}
          >
            <Select placeholder='Select' onChange={handleOnChangPrice} defaultValue={restaurantPrice}>
              <Option value='range'>Khoảng</Option>
              <Option value='up'>Trên</Option>
              <Option value='down'>Dưới</Option>
            </Select>
          </Form.Item>
          {restaurantPrice === 'range' ? (
            <>
              <Form.Item
                name={['restaurant_price', 'restaurant_price_min']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng nhập giá nhỏ nhất' }]}
              >
                <InputNumber style={{ width: '50%' }} placeholder='Giá nhỏ nhất' />
              </Form.Item>
              <Form.Item
                name={['restaurant_price', 'restaurant_price_max']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng nhập giá lớn nhất' }]}
              >
                <InputNumber style={{ width: '50%' }} placeholder='Giá lớn nhất' />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              name={['restaurant_price', 'restaurant_price_amount']}
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            >
              <InputNumber style={{ width: '50%' }} placeholder='Giá' />
            </Form.Item>
          )}
        </Space.Compact>
      </Form.Item>

      <div className='flex mb-5 ml-[208px]'>
        <label className='mr-2 whitespace-nowrap'>Tiện ích:</label>
        <div>
          <Tag data={amenity} setData={setAmenity} tag='Thêm tiện ích' className='w-full' type='amenity' />
        </div>
      </div>

      <div className='flex mb-5 ml-[138px]'>
        <label className='mr-2 whitespace-nowrap'>Loại hình nhà hàng:</label>
        <div>
          <Tag
            data={restaurantType}
            setData={setRestaurantType}
            tag='Thêm loại hình nhà hàng'
            className='w-full'
            type='restaurent-type'
          />
        </div>
      </div>

      <div className='flex ml-[173px] '>
        <label className='mr-2 whitespace-nowrap'>Ngày mở cửa: </label>
        <div>
          <Form.List
            name='restaurant_hours'
            initialValue={[
              {
                day_of_week: undefined,
                open: undefined,
                close: undefined
              }
            ]}
            rules={[
              {
                validator: (_, value) =>
                  value && value.length ? Promise.resolve() : Promise.reject('Cần có ít nhất 1 ngày mở nhà hàng')
              }
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const availableDays = dayOfWeek.filter(
                    (item: any) =>
                      !Object.values(selectedDays as any).includes(item?.value as any) ||
                      selectedDays[name] === item.value
                  )
                  return (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8, position: 'relative' }}
                      align='baseline'
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'day_of_week']}
                        rules={[{ required: true, message: 'Thứ trong tuần không được bỏ trống' }]}
                      >
                        <Select
                          placeholder='Thứ trong tuần'
                          onChange={(value) => handleDayChange(value, name)}
                          value={selectedDays[name] || undefined}
                          className='!w-32'
                        >
                          {availableDays.map((item, index) => (
                            <Select.Option key={index} value={item.value}>
                              {item.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'open']}
                        rules={[{ required: true, message: 'Giờ mở cửa không được bỏ trống' }]}
                      >
                        <Select placeholder='Giờ mở cửa' className='!w-32'>
                          {Hour.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'close']}
                        rules={[
                          {
                            required: true,
                            message: 'Giờ đóng cửa không được bỏ trống'
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const openValue = getFieldValue(['restaurant_hours', name, 'open'])
                              if (openValue && value && value <= openValue) {
                                return Promise.reject(new Error('Giờ đóng cửa phải lớn hơn giờ mở cửa'))
                              }
                              return Promise.resolve()
                            }
                          })
                        ]}
                      >
                        <Select placeholder='Giờ đóng cửa' className='!w-32'>
                          {Hour.map((item, index) => (
                            <Select.Option key={index} value={item.value}>
                              {item.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(name)
                            handleRemove(name)
                          }}
                          className='absolute top-8'
                        />
                      )}
                    </Space>
                  )
                })}
                {fields.length < 7 && (
                  <Form.Item className='w-[600px]'>
                    <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                      Add field
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </div>
      </div>

      <Form.Item<IRestaurant>
        label='Tư vấn-giữ chỗ'
        name={['restaurant_propose', 'propose_consultation_reservation', 'text']}
        rules={[{ required: true, message: 'Vui lòng nhập nội dung giới thiệu!' }]}
      >
        <MdEditor
          style={{ height: '200px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ html, text }) => {
            form.setFieldsValue({
              restaurant_propose: {
                propose_consultation_reservation: {
                  text
                }
              }
            })
          }}
          value={form.getFieldValue(['restaurant_propose', 'propose_consultation_reservation', 'text'])}
        />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Ưu đãi tặng kèm'
        name={['restaurant_propose', 'propose_bundled_offer', 'text']}
        rules={[{ required: true, message: 'Vui lòng nhập nội dung giới thiệu!' }]}
      >
        <MdEditor
          style={{ height: '200px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ html, text }) => {
            form.setFieldsValue({
              restaurant_propose: {
                propose_bundled_offer: {
                  text
                }
              }
            })
          }}
          value={form.getFieldValue(['restaurant_propose', 'propose_bundled_offer', 'text'])}
        />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Lưu ý'
        name={['restaurant_propose', 'propose_note', 'text']}
        rules={[{ required: true, message: 'Vui lòng nhập nội dung giới thiệu!' }]}
      >
        <MdEditor
          style={{ height: '200px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ html, text }) => {
            form.setFieldsValue({
              restaurant_propose: {
                propose_note: {
                  text
                }
              }
            })
          }}
          value={form.getFieldValue(['restaurant_propose', 'propose_note', 'text'])}
        />
      </Form.Item>

      <div className='ml-[204px] flex'>
        <label className='mr-2 whitespace-nowrap'>Phù hợp: </label>
        <div className='w-full'>
          <Form.List name={['restaurant_overview', 'overview_suitable']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Vui lòng nhập phù hợp' }]}
                    className='w-full'
                  >
                    <div className='flex gap-5'>
                      <Input placeholder='Phù hợp' />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm phù hợp
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <div className='ml-[178px] flex'>
        <label className='mr-2 whitespace-nowrap'>Món đặc sắc: </label>
        <div className='w-full'>
          <Form.List name={['restaurant_overview', 'overview_specialty_dish']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Vui lòng nhập món đặc sắc' }]}
                    className='w-full'
                  >
                    <div className='flex gap-5'>
                      <Input placeholder='Món đặc sắc' />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm món đặc sắc
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <div className='ml-[183px] flex'>
        <label className='mr-2 whitespace-nowrap'>Không gian: </label>
        <div className='w-full'>
          <Form.List name={['restaurant_overview', 'overview_space']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Vui lòng nhập không gian' }]}
                    className='w-full'
                  >
                    <div className='flex gap-5'>
                      <Input placeholder='Phù hợp' />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm không gian
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <div className='ml-[218px] flex'>
        <label className='mr-2 whitespace-nowrap'>Để xe: </label>
        <div className='w-full'>
          <Form.List name={['restaurant_overview', 'overview_parking_area']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Vui lòng nhập để xe' }]}
                    className='w-full'
                  >
                    <div className='flex gap-5'>
                      <Input placeholder='Để xe' />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm để xe
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <div className='ml-[189px] flex'>
        <label className='mr-2 whitespace-nowrap'>Đặc trưng: </label>
        <div className='w-full'>
          <Form.List name={['restaurant_overview', 'overview_characteristic']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Vui lòng nhập dặc trưng' }]}
                    className='w-full'
                  >
                    <div className='flex gap-5'>
                      <Input placeholder='Đặc trưng' />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm đặc trưng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <Form.Item<IRestaurant>
        label='Quy định'
        name={['restaurant_regulation', 'text']}
        rules={[{ required: true, message: 'Vui lòng nhập nội dung quy định!' }]}
      >
        <MdEditor
          style={{ height: '200px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ html, text }) => {
            form.setFieldsValue({
              restaurant_regulation: {
                text
              }
            })
          }}
          value={form.getFieldValue(['restaurant_regulation', 'text'])}
        />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Chỗ để xe'
        name={['restaurant_parking_area', 'text']}
        rules={[{ required: true, message: 'Vui lòng nhập chỗ để xe!' }]}
      >
        <MdEditor
          style={{ height: '200px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ html, text }) => {
            form.setFieldsValue({
              restaurant_parking_area: {
                text
              }
            })
          }}
          value={form.getFieldValue(['restaurant_parking_area', 'text'])}
        />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Mô tả nhà hàng'
        name={['restaurant_description', 'text']}
        rules={[{ required: true, message: 'Vui lòng nhập mô tả nhà hàng' }]}
      >
        <MdEditor
          style={{ height: '200px' }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ html, text }) => {
            form.setFieldsValue({
              restaurant_description: {
                text
              }
            })
          }}
          value={form.getFieldValue(['restaurant_description', 'text'])}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
