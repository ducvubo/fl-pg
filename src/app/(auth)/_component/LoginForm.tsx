'use client'
import React, { useEffect } from 'react'
import type { FormProps } from 'antd'
import { Button, Checkbox, Form, Input } from 'antd'
import { signIn } from '@/auth'
import { authenticate } from '../auth.api'
import { Toast } from '@/app/components/Notification'

interface LoginForm {
  us_email: string
  us_password: string
}

const onFinish: FormProps<LoginForm>['onFinish'] = async (values) => {
  const { us_email, us_password } = values
  const res: string | { error: string; code: number } = await authenticate({ us_email, us_password })
  console.log(res)
  if (typeof res === 'string') {
    Toast('Thành công', 'Đăng nhập thành công', 'success')
  } else if (res.code === -1) {
    Toast('Lỗi', res.error, 'error')
  } else if (res.code === -2) {
    Toast('Lỗi', res.error, 'error')
  } else if (res.code === -3) {
    Toast('Lỗi', res.error, 'error')
  } else if (res.code === -4) {
    Toast('Lỗi', res.error, 'error')
  } else if (res.code === -5) {
    Toast('Lỗi', res.error, 'error')
  } else {
    Toast('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau', 'error')
  }
  // console.log(res)
  // console.log('Success:', values)
}

const onFinishFailed: FormProps<LoginForm>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function LoginForm() {
  const [form] = Form.useForm()

  useEffect(() => {
    // Sử dụng setFieldsValue để đặt giá trị cho form
    form.setFieldsValue({
      us_email: 'vminhduc8@gmail.com',
      us_password: 'M9{!,><XUru%t6%C'
    })
  }, [form])

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
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<LoginForm>
        label='Password'
        name='us_password'
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
