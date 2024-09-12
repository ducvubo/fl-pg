'use client'
import { Button, Form, FormProps, GetProp, Input, Select, Upload, UploadFile, UploadProps, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import { IRole, IUserModel } from '../user.interface'
import { createUser, getRoleUser, updateUser } from '../user.api'
import { useLoading } from '@/app/context/LoadingContext'
import { Toast } from '@/app/components/Notification'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IUser } from '@/app/(auth)/auth.interface'
import { useRouter } from 'next/navigation'
import { PlusOutlined } from '@ant-design/icons'
import { isNumericString } from '@/app/utils'
import { identity } from 'lodash'

const onFinishFailed: FormProps<IUserModel>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

interface Props {
  id: string
  inforUser?: IUserModel
}
export default function AddOrEdit({ id, inforUser }: Props) {
  const { setLoading } = useLoading()
  const [form] = Form.useForm()
  const router = useRouter()
  const [listRole, setListRole] = useState<IRole[]>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imageAvatar, setImageAvatar] = useState<UploadFile[]>([])

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setImageAvatar(newFileList)

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const getListRoleUser = async () => {
    setLoading(true)
    const res: IBackendRes<IRole[]> = await getRoleUser()
    if (res.statusCode === 200) {
      setLoading(false)
      setListRole(res.data)
    } else if (res.code === -10) {
      setLoading(false)
      Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setLoading(false)
      Toast('Thông báo', res.message, 'warning')
    } else {
      Toast('Thông báo', 'Đã có lỗi xảy ra vui lòng thử lại sau', 'warning')
    }
  }

  useEffect(() => {
    getListRoleUser()
  }, [])

  useEffect(() => {
    if (inforUser && id !== 'add') {
      form.setFieldsValue({
        us_email: inforUser.us_email,
        us_phone: inforUser.us_phone,
        us_name: inforUser.us_name,
        us_gender: inforUser.us_gender,
        us_password: 'NOPASSWORD',
        us_address: inforUser.us_address,
        us_role: inforUser.us_role,
        us_avatar: inforUser.us_avatar ? inforUser.us_avatar : ''
      })
      if (inforUser.us_avatar) {
        setImageAvatar([
          {
            uid: '-1',
            name: inforUser.us_avatar?.image_cloud,
            status: 'done',
            url: inforUser.us_avatar.image_cloud,
            thumbUrl: inforUser.us_avatar.image_cloud
          }
        ])
      }
    }
  }, [id, inforUser])

  useEffect(() => {
    if (imageAvatar.length > 0) {
      const updatedBanner = imageAvatar[0]?.response?.data
        ? imageAvatar[0]?.response?.data?.image_cloud
        : imageAvatar[0]?.thumbUrl
      setImageAvatar([
        {
          ...imageAvatar[0],
          thumbUrl: updatedBanner
        }
      ])

      form.setFieldsValue({
        us_avatar: imageAvatar[0]?.response?.data
      })
    }
  }, [imageAvatar[0]?.response])

  const onFinish: FormProps<IUserModel>['onFinish'] = async (values) => {
    setLoading(true)
    if (!isNumericString(values.us_phone)) {
      Toast('Lỗi', 'Số điện thoại phải là số và có 10 ký tự trở lên', 'warning')
      setLoading(false)
      return
    }

    if (id === 'add') {
      const res: IBackendRes<IUser> = await createUser(values)
      if (res.statusCode === 201) {
        setLoading(false)
        Toast('Thành công', 'Thêm mới thành công', 'success')
        router.push('/dashboard/user')
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
      } else if (res.statusCode === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setLoading(false)
        Toast('Thông báo', res.message, 'warning')
      } else {
        setLoading(false)
        Toast('Thông báo', 'Đã có lỗi xảy ra vui lòng thử lại sau', 'warning')
      }
    } else if (id !== 'add' && inforUser) {
      const res: IBackendRes<IUser> = await updateUser({ ...values, _id: id })
      if (res.statusCode === 200) {
        setLoading(false)
        Toast('Thành công', 'Cập nhật thành công', 'success')
        router.push('/dashboard/user')
      } else if (res.statusCode === 404) {
        setLoading(false)
        Toast('Lỗi', 'Người dùng không tồn tại', 'warning')
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
      } else if (res.statusCode === -10) {
        setLoading(false)
        Toast('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.', 'warning')
        await deleteCookiesAndRedirect()
      } else if (res.code === -11) {
        setLoading(false)
        Toast('Thông báo', res.message, 'warning')
      } else {
        setLoading(false)
        Toast('Thông báo', 'Đã có lỗi xảy ra vui lòng thử lại sau', 'warning')
      }
    }

    console.log('Success:', values)
  }

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item<IUserModel>
        label='Ảnh bìa'
        getValueFromEvent={normFile}
        name='us_avatar'
        // rules={[{ required: true, message: 'Vui lòng chọn avatar!' }]}
      >
        <div>
          <Upload
            action={`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload`}
            maxCount={1}
            listType='picture-card'
            fileList={imageAvatar}
            onPreview={handlePreview}
            onChange={handleChange}
            headers={{ folder_type: 'avatar_user' }}
          >
            {imageAvatar.length >= 1 ? null : uploadButton}
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

      <Form.Item<IUserModel> label='Email' name='us_email' rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
        <Input disabled={id !== 'add' ? true : false} />
      </Form.Item>

      <Form.Item<IUserModel>
        label='Mật khẩu'
        name='us_password'
        rules={[{ required: true, message: 'Vui lòng nhập password' }]}
      >
        <Input.Password disabled={id !== 'add' ? true : false} />
      </Form.Item>

      <Form.Item<IUserModel>
        label='Tên người dùng'
        name='us_name'
        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IUserModel>
        label='Địa chỉ'
        name='us_address'
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IUserModel>
        label='Số điện thoại'
        name='us_phone'
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<IUserModel> label='Giới tính' name='us_gender'>
        <Select>
          <Select.Option value='Nam'>Nam</Select.Option>
          <Select.Option value='Nữ'>Nữ</Select.Option>
          <Select.Option value='Khác'>Khác</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label='Quyền' name='us_role'>
        <Select>
          {listRole?.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.rl_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
