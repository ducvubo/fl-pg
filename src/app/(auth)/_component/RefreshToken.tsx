// 'use client'
// import React, { useLayoutEffect } from 'react'
// import { reFreshTokenNew } from '../auth.api'
// import { useDispatch } from 'react-redux'
// import { startAppUser } from '../auth.slice'
// import { IUser } from '../auth.interface'
// import { useRouter } from 'next/navigation'

// export default function RefreshToken() {
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const runAppUser = (inforUser: IUser) => {
//     dispatch(startAppUser(inforUser))
//   }
//   const refreshToken = async () => {
//     const res = await reFreshTokenNew()
//     if (res?.code === 0 && res.data) {
//       runAppUser(res.data)
//       const currentPathname = window.location.pathname
//       // Navigate based on user role if not already on the target page
//       if (res.data.us_role.rl_name === 'admin' && !currentPathname.startsWith('/dashboard')) {
//         router.push('/dashboard')
//       }
//       if (res.data.us_role.rl_name !== 'admin' && currentPathname.startsWith('/dashboard')) {
//         router.push('/')
//       }
//     }
//   }

//   useLayoutEffect(() => {
//     refreshToken()
//     const interval = setInterval(() => {
//       refreshToken()
//     }, 1000 * 60 * 10)
//     return () => clearInterval(interval)
//   }, [])

//   return <></>
// }

'use client'
import React, { useLayoutEffect } from 'react'
import { reFreshTokenNew } from '../auth.api'
import { useDispatch } from 'react-redux'
import { startAppUser } from '../auth.slice'
import { IUser } from '../auth.interface'
import { useRouter } from 'next/navigation'

export default function RefreshToken() {
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }

  const refreshToken = async () => {
    const lastRefreshTime = localStorage.getItem('last_refresh_token_time_fl')
    const currentTime = Date.now()

    // Kiểm tra nếu lần cuối refresh token dưới 10 phút thì không thực hiện nữa
    if (lastRefreshTime && currentTime - parseInt(lastRefreshTime, 10) < 1000 * 60 * 10) {
      console.log('Token đã được làm mới gần đây, bỏ qua việc làm mới')
      return
    }

    // Gọi API refresh token
    const res = await reFreshTokenNew()
    if (res?.code === 0 && res.data) {
      runAppUser(res.data)

      // Lưu thời gian làm mới vào localStorage
      localStorage.setItem('last_refresh_token_time_fl', currentTime.toString())

      const currentPathname = window.location.pathname
      // Điều hướng dựa trên vai trò người dùng
      if (res.data.us_role.rl_name === 'admin' && !currentPathname.startsWith('/dashboard')) {
        router.push('/dashboard')
      }
      if (res.data.us_role.rl_name !== 'admin' && currentPathname.startsWith('/dashboard')) {
        router.push('/')
      }
    }
  }

  useLayoutEffect(() => {
    refreshToken()

    // Thiết lập interval gọi API làm mới mỗi 10 phút
    const interval = setInterval(() => {
      refreshToken()
    }, 1000 * 60 * 10)

    return () => clearInterval(interval)
  }, [])

  return <></>
}
