import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { cookies } from 'next/headers'
import queryString from 'query-string'

export const sendRequest = async <T>(props: IRequest) => {
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props
  let options: any
  const cookie = cookies()
  const access_token = cookie.get('access_token')?.value
  const refresh_token = cookie.get('refresh_token')?.value

  if (access_token && refresh_token) {
    options = {
      method: method,
      // by default setting the content-type to be json type
      headers: new Headers({
        'content-type': 'application/json',
        'x-at-tk': `Bearer ${access_token}`,
        'x-rf-tk': `Bearer ${refresh_token}`,
        ...headers
      }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }
  if (!access_token || !refresh_token) {
    options = {
      method: method,
      // by default setting the content-type to be json type
      headers: new Headers({ 'content-type': 'application/json', ...headers }),
      body: body ? JSON.stringify(body) : null,
      ...nextOption
    }
  }

  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T //generic
    } else {
      return res.json().then(async function (json) {
        console.log(json)
        if (res.status === 401 && json?.code === -10) {
          console.log('object')
          // cookies().delete('refresh_token')
          // cookies().delete('access_token')
          await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/cookie`, {
            method: 'POST'
          })

          return {
            statusCode: res.status,
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.',
            error: json?.error ?? '',
            code: json?.code
          } as T
        }
        if (res.status === 403) {
          return {
            statusCode: res.status,
            message: 'Bạn không có quyền truy cập vào trang này, vui lòng liên hệ quản trị viên để được hỗ trợ',
            error: json?.error ?? '',
            code: -11
          } as T
        }
        return {
          statusCode: res.status,
          message: json?.message ?? '',
          error: json?.error ?? '',
          code: json?.code ?? ''
        } as T
      })
    }
  })
}

export const sendRequestFile = async <T>(props: IRequest) => {
  //type
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ ...headers }),
    body: body ? body : null,
    ...nextOption
  }
  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T //generic
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? '',
          error: json?.error ?? '',
          code: json?.code ?? ''
        } as T
      })
    }
  })
}
