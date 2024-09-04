import { notification } from 'antd'

export const Toast = (
  message: string,
  description: string,
  type: 'success' | 'info' | 'warning' | 'error',
  pauseOnHover = true
) => {
  notification[type]({
    message,
    style: {
      height: 'auto',
      display: 'flex',
      alignItems: 'center',
      borderRadius: 10
    },
    description,
    showProgress: true,
    pauseOnHover
  })
}
