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
import { initialState, startAppUser } from '../auth.slice'
import { IUser } from '../auth.interface'
import { useRouter } from 'next/navigation'
import { CloudFog } from 'lucide-react'

export default function RefreshToken() {
  const dispatch = useDispatch()
  const router = useRouter()

  const runAppUser = (inforUser: IUser) => {
    dispatch(startAppUser(inforUser))
  }

  const refreshToken = async () => {
    // Gọi API refresh token
    const res = await reFreshTokenNew()
    console.log(res)
    if (res?.code === 0 && res.data) {
      runAppUser(res.data)
      const currentPathname = window.location.pathname
      if (res.data.us_role.rl_name === 'admin' && !currentPathname.startsWith('/dashboard')) {
        router.push('/dashboard')
      }
      if (res.data.us_role.rl_name !== 'admin' && currentPathname.startsWith('/dashboard')) {
        router.push('/')
      }
    } else {
      runAppUser(initialState)
      router.push('/login')
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
