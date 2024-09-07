import { configureStore } from '@reduxjs/toolkit'
import inforUserReducer from '../(auth)/auth.slice'
// ...

export const store = configureStore({
  reducer: {
    inforUser: inforUserReducer
  }
  //Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk query
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger)
})
// Optional, nhưng bắt buộc nếu muốn dùng tính năng refetchOnFocus và refetchOnReconnect
// setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
