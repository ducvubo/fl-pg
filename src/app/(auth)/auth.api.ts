'use server'
import { IToken, signIn } from '@/auth'
import { sendRequest } from '@/lib/api'

export async function authenticate({ us_email, us_password }: { us_email: string; us_password: string }) {
  try {
    const r = await signIn('credentials', {
      us_email,
      us_password,
      type: 'login',
      // callbackUrl: '/',
      redirect: false
    })
    return r
  } catch (error) {
    // console.log('check error:::', JSON.stringify(error))
    if ((error as any).name === 'InvalidEmailPasswordError') {
      return {
        error: (error as any).type,
        code: -1
      }
    }
    if ((error as any).name === 'AccountNotVerify') {
      return {
        error: (error as any).type,
        code: -2
      }
    }
    if ((error as any).name === 'AccountIsDisable') {
      return {
        error: (error as any).type,
        code: -3
      }
    }
    if ((error as any).name === 'InternalServer') {
      return {
        error: (error as any).type,
        code: -4
      }
    } else {
      return {
        error: 'Lỗi không xác định',
        code: -5
      }
    }
  }
}

export const register = async ({ us_email }: { us_email: string }) => {
  try {
    const r = await signIn('credentials', {
      us_email,
      type: 'register',
      // callbackUrl: '/',
      redirect: false
    })
    return r
  } catch (error) {
    // console.log('check error:::', JSON.stringify(error))
  }
}
export const refreshTokenNew = async () => {
  try {
    const r = await signIn('credentials', {
      us_email: 'a',
      us_password: 'a',
      type: 'refreshToken',
      redirect: false
    })
    return r
  } catch (error) {
    // console.log('check error:::', JSON.stringify(error))
  }
}

export const refreshToken = async ({ refresh_token }: { refresh_token: string }) => {
  const res: IBackendRes<IToken> = await sendRequest({
    url: `${process.env.URL_SERVER}/auth/refresh`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${refresh_token}`
    }
  })

  console.log('REfresh token sent:::::::', res)
  return res
}
