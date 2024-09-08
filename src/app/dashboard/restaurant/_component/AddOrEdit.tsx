'use client'
import React, { lazy, useEffect, useState } from 'react'
import type { FormProps, GetProp, UploadFile, UploadProps } from 'antd'
import { Button, Checkbox, Form, Input, InputNumber, Select, Upload, Image, Cascader, Space } from 'antd'
import { ICategory } from '../../category/category.interface'
import { getAllCategory } from '../../category/category.api'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IRestaurant } from '../restaurant.interface'
import { dataAdress } from '@/address.data'
import Tag from './Tag'
import { createRestaurant, updateRestaurant } from '../restaurant.api'
import dynamic from 'next/dynamic'
import { dayOfWeek, defaultOverview, defaultParkingArea, defaultPropose, defaultRegulation, Hour } from './Default.data'
import { Toast } from '@/app/components/Notification'
import { useLoading } from '@/app/context/LoadingContext'
import { checkDuplicateDays } from '@/app/utils'
import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
const Editor = dynamic(() => import('@/app/components/Editor'), { ssr: false })
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

interface Props {
  id: string
  inforRestaurant?: IRestaurant
}

export default function AddOrEdit({ id, inforRestaurant }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [form] = Form.useForm()
  const [listCategory, setlistCategory] = useState<ICategory[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imageBanner, setImageBanner] = useState<UploadFile[]>([])
  const [imageRestaurant, setImageRestaurant] = useState<UploadFile[]>([])
  const [restaurantType, setRestaurantType] = useState<{ name: string; _id: string }[]>([])
  const [amenity, setAmenity] = useState<{ name: string; _id: string }[]>([])
  const [restaurantPrice, setrestaurantPrice] = useState<'range' | 'up' | 'down'>('range')
  const [selectedDays, setSelectedDays] = useState<string[]>([]) // State to track selected days
  const [propose, setPropose] = useState(defaultPropose)
  const [overview, setOverview] = useState(defaultOverview)
  const [regulation, setRegulation] = useState(defaultRegulation)
  const [parkingArea, setParkingArea] = useState(defaultParkingArea)
  const [description, setDescription] = useState('')

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
  }, [])

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

  const onFinish: FormProps<IRestaurant>['onFinish'] = async (values) => {
    setLoading(true)
    const restaurant_address: any = CustomAddress(dataAdress, values)

    const restaurant_amenity = amenity.map((item: any) => item._id)
    const restaurant_type = restaurantType.map((item: any) => item._id)
    const checkDay = checkDuplicateDays(values.restaurant_hours)
    if (checkDay) {
      setLoading(false)
      Toast('Lỗi', checkDay, 'warning')
      return
    }
    const payload: IRestaurant = {
      ...values,
      restaurant_address,
      restaurant_overview: overview,
      restaurant_regulation: regulation,
      restaurant_parking_area: parkingArea,
      restaurant_description: description,
      restaurant_propose: propose,
      restaurant_amenity,
      restaurant_type
    }

    try {
      if (id === 'add') {
        const res: IBackendRes<IRestaurant> = await createRestaurant(payload)
        if (res.statusCode === 201) {
          setLoading(false)
          Toast('Thành công', 'Tạo nhà hàng thành công', 'success')
        } else if (res.statusCode === 400) {
          setLoading(false)
          if (Array.isArray(res.message)) {
            res.message.map((item: string) => {
              Toast('Lỗi', item, 'warning')
            })
          } else {
            Toast('Lỗi', res.message, 'warning')
          }
        } else if (res.statusCode === 409) {
          setLoading(false)
          Toast('Lỗi', res.message, 'warning')
        } else if (res.code === -10) {
          setLoading(false)
          Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
          // router.push('/login')
          await deleteCookiesAndRedirect()
        } else if (res.code === -11) {
          setLoading(false)
          Toast('Thông báo', res.message, 'warning')
        }
      } else {
        const res = await updateRestaurant({ ...payload, _id: id })
        if (res.statusCode === 200) {
          setLoading(false)
          Toast('Thành công', 'Cập nhật nhà hàng thành công', 'success')
        } else if (res.statusCode === 400) {
          setLoading(false)
          if (Array.isArray(res.message)) {
            res.message.map((item: string) => {
              Toast('Lỗi', item, 'warning')
            })
          } else {
            Toast('Lỗi', res.message, 'warning')
          }
        } else if (res.statusCode === 409) {
          setLoading(false)
          Toast('Lỗi', res.message, 'warning')
        } else if (res.code === -10) {
          setLoading(false)
          Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
          // router.push('/login')
          await deleteCookiesAndRedirect()
        } else if (res.code === -11) {
          setLoading(false)
          Toast('Thông báo', res.message, 'warning')
        }
      }
    } catch (error) {
      setLoading(false)
      Toast('Lỗi không xác định', 'Vui lòng thử lại sau', 'error')
    }
  }

  const onFinishFailed: FormProps<IRestaurant>['onFinishFailed'] = (errorInfo) => {
    const restaurant_address: any = CustomAddress(dataAdress, errorInfo.values)
  }

  useEffect(() => {
    if (inforRestaurant) {
      form.setFieldsValue({
        restaurant_email: inforRestaurant.restaurant_email,
        restaurant_name: inforRestaurant.restaurant_name,
        restaurant_phone: inforRestaurant.restaurant_phone,
        restaurant_category: inforRestaurant.restaurant_category,
        restaurant_password: 'NOPASSWORD',
        restaurant_address: buildAddress(dataAdress, inforRestaurant.restaurant_address),
        restaurant_price: {
          restaurant_price_option: inforRestaurant.restaurant_price.restaurant_price_option,
          restaurant_price_amount: inforRestaurant?.restaurant_price?.restaurant_price_amount,
          restaurant_price_min: inforRestaurant?.restaurant_price?.restaurant_price_min,
          restaurant_price_max: inforRestaurant?.restaurant_price?.restaurant_price_max
        },
        restaurant_hours: inforRestaurant.restaurant_hours,
        restaurant_banner: inforRestaurant.restaurant_banner
        // restaurant_image: inforRestaurant.restaurant_image
      })

      setrestaurantPrice(inforRestaurant.restaurant_price.restaurant_price_option)
      setRestaurantType(
        inforRestaurant.restaurant_type.map((item: any) => ({
          name: item.restaurant_type_name,
          _id: item._id
        }))
      )
      setAmenity(
        inforRestaurant.restaurant_amenity.map((item: any) => ({
          name: item.amenity_name,
          _id: item._id
        }))
      )
      setPropose(inforRestaurant.restaurant_propose)
      setOverview(inforRestaurant.restaurant_overview)
      setRegulation(inforRestaurant.restaurant_regulation)
      setParkingArea(inforRestaurant.restaurant_parking_area)
      setDescription(inforRestaurant.restaurant_description)
      setImageRestaurant(
        inforRestaurant.restaurant_image.map((item: any) => ({
          uid: String(Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1),
          name: item.image_cloud,
          status: 'done',
          response: {
            statusCode: 201,
            data: {
              image_local: item.image_local,
              image_cloud: item.image_cloud,
              image_custom: item.image_custom
            }
          },
          url: item.image_cloud,
          thumbUrl: item.image_cloud
        }))
      )
      setImageBanner([
        {
          uid: '-1',
          name: inforRestaurant.restaurant_banner.image_cloud,
          status: 'done',
          url: inforRestaurant.restaurant_banner.image_cloud,
          thumbUrl: inforRestaurant.restaurant_banner.image_cloud
        }
      ])
      setSelectedDays(inforRestaurant.restaurant_hours.map((item) => item.day_of_week))
    }
  }, [id, inforRestaurant])

  useEffect(() => {
    if (imageBanner.length > 0) {
      form.setFieldsValue({
        restaurant_image: imageRestaurant.map((item) => {
          if (item.response?.statusCode === 201) return item.response?.data
          else return
        })
      })
    }
  }, [imageRestaurant])

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      initialValues={{
        remember: true,
        // restaurant_hours: [{}],
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
      {/* <Button onClick={test}>abc</Button> */}
      <Form.Item<IRestaurant>
        label='Ảnh nhà hàng'
        getValueFromEvent={normFile}
        name='restaurant_image'
        rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
      >
        <div>
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
        </div>
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Ảnh bìa'
        getValueFromEvent={normFile}
        name='restaurant_banner'
        rules={[{ required: true, message: 'Vui lòng chọn banner!' }]}
      >
        <div>
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
        </div>
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
        <Input disabled={id !== 'add' ? true : false} />
      </Form.Item>

      <Form.Item<IRestaurant>
        label='Password'
        name='restaurant_password'
        rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
      >
        <Input.Password disabled={id !== 'add' ? true : false} />
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
            <Select placeholder='Select' onChange={handleOnChangPrice}>
              <Option value='range'>Khoảng</Option>
              <Option value='up'>Trên</Option>
              <Option value='down'>Dưới</Option>
            </Select>
          </Form.Item>
          {restaurantPrice === 'range' ? (
            <Space.Compact>
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
            </Space.Compact>
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
                          className='absolute top-2'
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

      <div className='flex ml-[208px] mb-10'>
        <label className='mr-2 whitespace-nowrap'>Đề xuất: </label>
        <div>
          <Editor data={propose} setData={setPropose} defaultData={propose} />
        </div>
      </div>

      <div className='flex ml-[209px] mb-10'>
        <label className='mr-2 whitespace-nowrap'>Tóm tắt: </label>
        <div>
          <Editor data={overview} setData={setOverview} defaultData={overview} />
        </div>
      </div>

      <div className='flex ml-[200px] mb-10'>
        <label className='mr-2 whitespace-nowrap'>Quy định: </label>
        <div>
          <Editor data={regulation} setData={setRegulation} defaultData={regulation} />
        </div>
      </div>

      <div className='flex ml-[195px] mb-10'>
        <label className='mr-2 whitespace-nowrap'>Chỗ để xe: </label>
        <div>
          <Editor data={parkingArea} setData={setParkingArea} defaultData={parkingArea} />
        </div>
      </div>

      <div className='flex ml-[160px] mb-10'>
        <label className='mr-2 whitespace-nowrap'>Mô tả nhà hàng: </label>
        <div>
          <Editor data={description} setData={setDescription} defaultData={description} />
        </div>
      </div>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
