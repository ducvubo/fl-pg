'use server'
import { sendRequest } from '@/lib/api'
import { IToken, IUser } from './auth.interface'
import { cookies } from 'next/headers'
import { deleteCookie, deleteCookiesAndRedirect } from '../actions/action'

export const getMe = async ({ access_token, refresh_token }: IToken) => {
  const res: IBackendRes<IUser> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/me`,
    method: 'GET',
    headers: {
      'x-at-tk': `Bearer ${access_token}`,
      'x-rf-tk': `Bearer ${refresh_token}`
    }
  })
  return res
}

export const login = async ({ us_email, us_password }: { us_email: string; us_password: string }) => {
  const res: IBackendRes<IToken> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/login`,
    method: 'POST',
    body: {
      us_email,
      us_password
    }
  })
  console.log(res)
  if (res.statusCode === 201 && res.data) {
    const data = await Promise.all([
      await cookies().set({
        name: 'access_token',
        value: res.data.access_token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 15
      }),
      await cookies().set({
        name: 'refresh_token',
        value: res.data.refresh_token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 15
      }),
      await getMe(res.data)
    ])

    const resProfile: IBackendRes<IUser> = data[2]

    console.log('resProfile:::::::', resProfile)

    if (resProfile.statusCode === 200 && resProfile.data) {
      return {
        data: resProfile.data,
        message: 'Đăng nhập thành công',
        code: 0
      }
    } else if (resProfile.statusCode === 401) {
      return {
        message: 'Email hoặc mật khẩu không đúng',
        code: -1
      }
    } else {
      return {
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        code: -4
      }
    }
  } else if (res.statusCode === 401) {
    if (res.code === -1) {
      return {
        message: 'Email hoặc mật khẩu không đúng',
        code: -1
      }
    }
    if (res.code === -2) {
      return {
        message: 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt lại',
        code: -2
      }
    }
    if (res.code === -3) {
      return {
        message: 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt rồi thử lại sau',
        code: -3
      }
    }
  } else if (res.statusCode === 400) {
    return {
      message: res.message,
      code: -5
    }
  }
}

export const register = async ({ us_email }: { us_email: string }) => {
  const res: IBackendRes<null> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/register`,
    method: 'POST',
    body: {
      us_email
    }
  })
  if (res.statusCode === 201) {
    return {
      message: 'Một email đã được gửi đến bạn, vui lòng kiểm tra email và kích hoạt tài khoản',
      code: 0
    }
  }
  if (res.statusCode === 409) {
    return {
      message: 'Email này đã được đăng ký, vui lòng sử dụng email khác',
      code: -1
    }
  } else {
    return {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      code: -2
    }
  }
}

export const reFreshTokenNew = async () => {
  const refresh_token = cookies().get('refresh_token')?.value

  if (!refresh_token) {
    return {
      code: -1,
      message: 'Refresh token không tồn tại'
    }
  }

  const res: IBackendRes<IToken> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/refresh-token`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${refresh_token}`
    }
  })

  if (res.statusCode === 201 && res.data) {
    const data = await Promise.all([
      await cookies().set({
        name: 'access_token',
        value: res.data.access_token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 15
      }),
      await cookies().set({
        name: 'refresh_token',
        value: res.data.refresh_token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 15
      }),
      await getMe(res.data)
    ])

    const resProfile: IBackendRes<IUser> = data[2]

    if (resProfile.statusCode === 200 && resProfile.data) {
      return {
        data: resProfile.data,
        message: 'Lấy thông tin thành công',
        code: 0
      }
    } else {
      return {
        message: 'Đã có lỗi xảy ra, vui lòng đăng nhập lại',
        code: -2
      }
    }
  }
  if (res.statusCode === 401 && res.code === -10) {
    await deleteCookie()
  }
}

export const comfirmAccount = async ({ us_email, otp }: { us_email: string; otp: string }) => {
  const res: IBackendRes<IToken> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/verify`,
    method: 'POST',
    body: {
      us_email,
      otp
    }
  })

  if (res.statusCode === 201 && res.data) {
    const data = await Promise.all([
      await cookies().set({
        name: 'access_token',
        value: res.data.access_token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 15
      }),
      await cookies().set({
        name: 'refresh_token',
        value: res.data.refresh_token,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 15
      }),
      await getMe(res.data)
    ])

    const resProfile: IBackendRes<IUser> = data[2]

    if (resProfile.statusCode === 200 && resProfile.data) {
      return {
        data: resProfile.data,
        message: 'Xác nhận tài khoản thành công',
        code: 0
      }
    } else {
      return {
        message: 'Đã có lỗi xảy ra, vui lòng đăng nhập lại',
        code: -1
      }
    }
  }
  if (res.statusCode === 401) {
    return {
      message: 'Mã OTP không đúng',
      code: -2
    }
  } else {
    return {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      code: -3
    }
  }
}

export const forgotPassword = async ({ us_email }: { us_email: string }) => {
  const res: IBackendRes<null> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/forgot-password`,
    method: 'POST',
    body: {
      us_email
    }
  })

  if (res.statusCode === 201) {
    return {
      message: 'Một email đã được gửi đến bạn, vui lòng kiểm tra email và thay đổi mật khẩu',
      code: 0
    }
  }
  if (res.statusCode === 400) {
    return {
      message: res.message,
      code: -1
    }
  }

  if (res.statusCode === 404) {
    return {
      message: 'Tài khoản không tồn tại',
      code: -2
    }
  } else {
    return {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      code: -3
    }
  }
}

export const changePassword = async ({
  us_email,
  otp,
  us_password
}: {
  us_email: string
  otp: string
  us_password: string
}) => {
  const res: IBackendRes<null> = await sendRequest({
    url: `${process.env.URL_SERVER}/users/change-password`,
    method: 'POST',
    body: {
      us_email,
      otp,
      us_password
    }
  })

  if (res.statusCode === 201) {
    return {
      message: 'Đổi mật khẩu thành công',
      code: 0
    }
  }
  if (res.statusCode === 400) {
    return {
      message: res.message,
      code: -1
    }
  }
  if (res.statusCode === 401) {
    return {
      message: 'Mã OTP không đúng',
      code: -2
    }
  } else {
    return {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      code: -3
    }
  }
}

export const logout = async () => {
  await deleteCookie()
}
