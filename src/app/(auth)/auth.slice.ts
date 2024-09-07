import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from './auth.interface'

const initialState: IUser = {
  _id: '',
  us_name: '',
  us_email: '',
  us_address: '',
  us_phone: '',
  us_role: ''
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
        (state.us_role = action.payload.us_role)
    }
  }
})

const inforUserReducer = inforUserSlice.reducer
export const { startAppUser } = inforUserSlice.actions
export default inforUserReducer
