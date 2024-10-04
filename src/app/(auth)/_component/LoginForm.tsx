'use client'
import React, { useEffect } from 'react'
import type { FormProps } from 'antd'
import { Button, Checkbox, Form, Input } from 'antd'
import { login } from '../auth.api'
import { Toast } from '@/app/components/Notification'
import { useDispatch } from 'react-redux'
import { IUser } from '../auth.interface'
import { startAppUser } from '../auth.slice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLoading } from '@/app/context/LoadingContext'

interface LoginForm {
  us_email: string
  us_password: string
}

const onFinishFailed: FormProps<LoginForm>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function LoginForm() {
  const { setLoading } = useLoading()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }

  const onFinish: FormProps<LoginForm>['onFinish'] = async (values) => {
    setLoading(true)
    const res = await login(values)
    if (res?.code === 0 && res.data) {
      setLoading(false)
      runAppUser(res.data)
      Toast('Thành công', 'Đăng nhập thành công', 'success')
      if (res.data.us_role.rl_name === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/thong-tin-tai-khoan')
      }
    } else if (res?.code === -5) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          Toast('Lỗi', item, 'warning')
        })
      } else {
        Toast('Lỗi', res.message, 'warning')
      }
    } else {
      setLoading(false)
      Toast('Lỗi', res?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
    }
  }

  form.setFieldsValue({ us_email: 'vminhduc8@gmail.com', us_password: 'Duc17052003*' })

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
      <Form.Item<LoginForm>
        label='Email'
        name='us_email'
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

      <Form.Item<LoginForm>
        label='Password'
        name='us_password'
        rules={[{ required: true, message: 'Vui lòng nhập password' }]}
      >
        <Input.Password />
      </Form.Item>
      <Button type='link'>
        <Link href={'/forgot-password'}>Quên mật khẩu</Link>
      </Button>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
