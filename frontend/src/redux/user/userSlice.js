import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loading: false,
    error: null
  },
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
      updateUserStart: (state) =>{
        state.loading = true
      },
      updateUserSuccess: (state, action)=>{
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      },
      updateUserFailure: (state, action)=>{
        state.loading = false;
        state.error = action.payload;
      }
    }
});

export const { 
  signInStart, 
  signInSuccess, 
  signInFailure, 
  signOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess
} = userSlice.actions;

export default userSlice.reducer;