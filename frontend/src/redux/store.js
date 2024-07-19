import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';

export default configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),

});