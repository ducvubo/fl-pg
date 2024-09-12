import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from './auth.interface'

export const initialState: IUser = {
  _id: '',
  us_name: '',
  us_email: '',
  us_address: '',
  us_phone: '',
  us_gender: '',
  us_avatar: {
    image_cloud: '',
    image_custom: '',
  },
  us_role: {
    _id: '',
    rl_name: '',
    rl_description: ''
  }
}

const inforUserSlice = createSlice({
  name: 'inforUser',
  initialState,
  reducers: {
    startAppUser: (state, action: PayloadAction<IUser>) => {
      ;(state._id = action.payload._id),
        (state.us_name = action.payload.us_name),
        (state.us_email = action.payload.us_email),
        (state.us_address = action.payload.us_address),
        (state.us_phone = action.payload.us_phone),
        (state.us_role = action.payload.us_role),
        (state.us_avatar = action.payload.us_avatar),
        (state.us_gender = action.payload.us_gender)
    }
  }
})

const inforUserReducer = inforUserSlice.reducer
export const { startAppUser } = inforUserSlice.actions
export default inforUserReducer
