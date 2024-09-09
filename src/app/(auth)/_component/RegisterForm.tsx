'use client'
import React, { useEffect, useState } from 'react'
import type { FormProps, GetProps } from 'antd'
import { Button, Checkbox, Flex, Form, Input } from 'antd'
import { useLoading } from '@/app/context/LoadingContext'
import { comfirmAccount, register } from '../auth.api'
import { Toast } from '@/app/components/Notification'
import Title from 'antd/es/typography/Title'
import { useDispatch } from 'react-redux'
import { startAppUser } from '../auth.slice'
import { IUser } from '../auth.interface'
import { useRouter } from 'next/navigation'

interface RegisterForm {
  us_email: string
}

type OTPProps = GetProps<typeof Input.OTP>
export default function RegisterForm() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [us_email, setUs_email] = useState('')
  const [otp, setOtp] = useState('')
  const dispatch = useDispatch()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }

  const onFinish: FormProps<RegisterForm>['onFinish'] = async (values) => {
    setLoading(true)
    const res = await register(values)
    if (res?.code === 0) {
      setLoading(false)
      setUs_email(values.us_email)
      Toast('Thành công', res.message, 'success')
    } else if (res?.code === -1) {
      setLoading(false)
      Toast('Thất bại', res?.message, 'warning')
    } else if (res?.code === -2) {
      setLoading(false)
      Toast('Thất bại', res?.message, 'error')
    }
  }

  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text)
  }

  const sharedProps: OTPProps = {
    onChange
  }

  const verifyOTP = async () => {
    setLoading(true)
    const res = await comfirmAccount({ us_email, otp })
    if (res?.code === 0 && res.data) {
      setLoading(false)
      Toast('Thành công', 'Xác nhận thành công', 'success')
      runAppUser(res.data)
      if (res.data.us_role.rl_name === 'admin') {
        router.push('/dashboard')
      }
      if (res.data.us_role.rl_name === 'user') {
        router.push('/')
      }
    } else if (res?.code === -1) {
      setLoading(false)
      Toast('Thất bại', res?.message, 'warning')
    } else if (res?.code === -2 || res?.code === -3) {
      setLoading(false)
      Toast('Thất bại', res?.message, 'error')
    }
  }

  return (
    <>
      {!us_email ? (
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item<RegisterForm>
            label='Email'
            name='us_email'
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Flex gap='middle' align='flex-start' vertical>
          <Title level={5}>OTP</Title>
          <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />
          <Button onClick={verifyOTP}>Xác nhận</Button>
        </Flex>
      )}
    </>
  )
}
