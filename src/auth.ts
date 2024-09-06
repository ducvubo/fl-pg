import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { sendRequest } from './lib/api'
import { Toast } from './app/components/Notification'
import {
  AccountIsDisable,
  AccountNotVerify,
  InternalServer,
  InvalidEmailPasswordError,
  RefreshTokenError
} from './lib/error'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export interface IToken {
  access_token: string
  refresh_token: string
}

export interface IUser {
  id: string
  us_name: string
  us_email: string
  us_address: string
  token: {
    access_token: string
    refresh_token: string
  }
}

export interface IUserRes {
  _id: string
  us_name: string
  us_email: string
  us_address: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        us_email: {},
        us_password: {},
        type: {}
      },
      authorize: async (credentials) => {
        const { us_email, us_password, type } = credentials
        let user: IUser | null

        if (type === 'login') {
          const resLogin: IBackendRes<IToken> = await sendRequest({
            url: `${process.env.URL_SERVER}/users/login`,
            method: 'POST',
            body: {
              us_email,
              us_password
            }
          })
          if (resLogin.statusCode === 201 && resLogin.data) {
            const resProfile: IBackendRes<IUserRes> = await sendRequest({
              url: `${process.env.URL_SERVER}/users/me`,
              method: 'GET',
              headers: {
                'x-at-tk': `Bearer ${resLogin?.data?.access_token}`,
                'x-rf-tk': `Bearer ${resLogin?.data?.refresh_token}`
              },
              nextOption: {
                cache: 'no-store'
              }
            })

            if (resProfile.statusCode === 200 && resProfile.data) {
              user = {
                id: resProfile?.data?._id,
                us_name: resProfile?.data?.us_name,
                us_email: resProfile?.data?.us_email,
                us_address: resProfile?.data?.us_address,
                token: {
                  access_token: resLogin?.data?.access_token,
                  refresh_token: resLogin?.data?.refresh_token
                }
              }
              return user
            } else {
              throw new InvalidEmailPasswordError()
            }
          }
          if (resLogin.statusCode === 401) {
            if (resLogin.code === -1) throw new InvalidEmailPasswordError()
            if (resLogin.code === -2) throw new AccountIsDisable()
            if (resLogin.code === -3) throw new AccountNotVerify()
          } else {
            return null
          }
        } else if (type === 'register') {
          const session = await auth()

          console.log(session)
          console.log(us_email)
          return null
        } else if (type === 'refreshToken') {
          const session = await auth()
          if (session?.user?.token?.refresh_token) {
            const resRefresh: IBackendRes<IToken> = await sendRequest({
              url: `${process.env.URL_SERVER}/users/refresh-token`,
              method: 'POST',
              headers: {
                authorization: `Bearer ${session?.user?.token?.refresh_token}`
              }
            })

            console.log('resRefresh token sent::::::::', resRefresh)

            if (resRefresh.statusCode === 201 && resRefresh.data) {
              const resProfile: IBackendRes<IUserRes> = await sendRequest({
                url: `${process.env.URL_SERVER}/users/me`,
                method: 'GET',
                headers: {
                  'x-at-tk': `Bearer ${resRefresh?.data?.access_token}`,
                  'x-rf-tk': `Bearer ${resRefresh?.data?.refresh_token}`
                },
                nextOption: {
                  cache: 'no-store'
                }
              })

              if (resProfile.statusCode === 200 && resProfile.data) {
                user = {
                  id: resProfile?.data?._id,
                  us_name: resProfile?.data?.us_name,
                  us_email: resProfile?.data?.us_email,
                  us_address: resProfile?.data?.us_address,
                  token: {
                    access_token: resRefresh?.data?.access_token,
                    refresh_token: resRefresh?.data?.refresh_token
                  }
                }
                return user
              } else {
                throw new RefreshTokenError()
              }
            }
            if (resRefresh.statusCode === 401) {
              redirect('/')
              // throw new RefreshTokenError()
            } else {
              return null
            }
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user as IUser
      }
      return token
    },
    session({ session, token }: any) {
      session.user = token.user as IUser
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    // Thiết lập thời gian session là 1 ngày (24 giờ * 60 phút * 60 giây)
    maxAge: 24 * 60 * 60 // 1 ngày
  }
})
