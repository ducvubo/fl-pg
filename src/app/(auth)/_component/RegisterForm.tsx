'use client'
import React, { useEffect } from 'react'
import type { FormProps } from 'antd'
import { Button, Checkbox, Form, Input } from 'antd'
import { signIn } from '@/auth'
import { authenticate, register } from '../auth.api'
import { Toast } from '@/app/components/Notification'

interface LoginForm {
  us_email: string
}

const onFinish: FormProps<LoginForm>['onFinish'] = async (values) => {
  const { us_email } = values
  const res: string | { error: string; code: number } = await register({ us_email })

  console.log(res)
  // console.log(res)
  // console.log('Success:', values)
}

const onFinishFailed: FormProps<LoginForm>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function RegisterForm() {
  const [form] = Form.useForm()

  useEffect(() => {
    // Sử dụng setFieldsValue để đặt giá trị cho form
    form.setFieldsValue({
      us_email: 'vminhduc8@gmail.com'
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

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
