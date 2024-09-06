import { AuthError } from 'next-auth'

export class CustomAuthError extends AuthError {
  static type: string

  constructor(message?: any) {
    super()
    this.type = message
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type: string = 'Email/Password không hợp lệ'
}

export class SignTokenExist extends AuthError {
  static type: string = 'Đã có lỗi xảy ra vui lòng thử lại'
}

export class AccountNotVerify extends AuthError {
  static type: string = 'Tài khoản của bạn chưa được kích hoạt, vui lòng kích hoạt rồi thử lại sau'
}

export class AccountIsDisable extends AuthError {
  static type: string = 'Tài khoản của bạn đã bị khóa, vui lòng liên hệ với quản trị viên để biết thêm thông tin'
}

export class InternalServer extends AuthError {
  static type: string = 'Lỗi không xác định, vui lòng thử lại sau ít phút'
}

export class RefreshTokenError extends AuthError {
  static type: string = 'Không tìm thấy token ở header hoặc token đã hết hạn vui lòng đăng nhập lại'
}
