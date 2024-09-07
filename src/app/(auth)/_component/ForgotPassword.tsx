'use client'
import React, { useEffect, useState } from 'react'
import type { FormProps, GetProps } from 'antd'
import { Button, Checkbox, Flex, Form, Input } from 'antd'
import { useLoading } from '@/app/context/LoadingContext'
import { changePassword, comfirmAccount, forgotPassword, register } from '../auth.api'
import { Toast } from '@/app/components/Notification'
import Title from 'antd/es/typography/Title'
import { useDispatch } from 'react-redux'
import { startAppUser } from '../auth.slice'
import { IUser } from '../auth.interface'
import { useRouter } from 'next/navigation'

interface ForgotPasswordForm {
  us_email: string
}

type OTPProps = GetProps<typeof Input.OTP>
export default function ForgotPassword() {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [us_email, setUs_email] = useState('')
  const [us_password, setUs_password] = useState('')
  const [otp, setOtp] = useState('')
  const dispatch = useDispatch()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }

  const onFinish: FormProps<ForgotPasswordForm>['onFinish'] = async (values) => {
    setLoading(true)
    const res = await forgotPassword(values)
    if (res?.code === 0) {
      setLoading(false)
      setUs_email(values.us_email)
      Toast('Thành công', res.message, 'success')
    }
    if (res?.code === -1) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          Toast('Lỗi', item, 'warning')
        })
      } else {
        Toast('Lỗi', res.message, 'warning')
      }
    }
    if (res?.code === -2) {
      setLoading(false)
      Toast('Lỗi', res.message, 'error')
    }
    if (res.code === -3) {
      setLoading(false)
      Toast('Lỗi', res.message, 'warning')
    }
  }

  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text)
  }

  const sharedProps: OTPProps = {
    onChange
  }

  const handleChangePassword = async () => {
    setLoading(true)
    const res = await changePassword({
      us_email,
      us_password,
      otp
    })
    if (res?.code === 0) {
      setLoading(false)
      Toast('Thành công', res.message, 'success')
      router.push('/login')
    }
    if (res?.code === -1) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          Toast('Lỗi', item, 'warning')
        })
      } else {
        Toast('Lỗi', res.message, 'warning')
      }
    }
    if (res?.code === -2) {
      setLoading(false)
      Toast('Lỗi', res.message, 'error')
    }
    if (res.code === -3) {
      setLoading(false)
      Toast('Lỗi', res.message, 'warning')
    }
  }

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUs_password(event.target.value)
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
          <Form.Item<ForgotPasswordForm>
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
          <Input.Password onChange={handlePasswordChange} />
          <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
        </Flex>
      )}
    </>
  )
}
