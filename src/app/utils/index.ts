import { IRestaurantHours } from '../dashboard/restaurant/restaurant.interface'

export const checkDuplicateDays = (openingTimes: IRestaurantHours[]): string | null => {
  const dayCount: Record<string, number> = {}

  for (const time of openingTimes) {
    const day = time.day_of_week
    dayCount[day] = (dayCount[day] || 0) + 1

    if (dayCount[day] > 1) {
      return `Không thể có ${dayCount[day]} ngày mở cửa giống nhau: ${day}`
    }
  }

  return null // Không có lỗi
}

export const isNumericString = (str: string) => {
  // Kiểm tra xem chuỗi có chỉ chứa các ký tự số (0-9) hay không
  return /^[0-9]{10,}$/.test(str)
}
