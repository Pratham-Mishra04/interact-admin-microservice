import { RootState } from '@/store';
import { User } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNo: string;
  profilePic: string;
  coverPic: string;
  isSuperAdmin: boolean;
}

const initialState: UserState = {
  id: '',
  name: '',
  username: '',
  profilePic: '',
  coverPic: '',
  email: '',
  phoneNo: '',
  isSuperAdmin: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
      state.coverPic = action.payload.coverPic;
      state.phoneNo = action.payload.phoneNo;
      state.isSuperAdmin = action.payload.superAdmin;
    },
    resetUser: state => {
      state.id = '';
      state.name = '';
      state.username = '';
      state.email = '';
      state.profilePic = 'default.jpg';
      state.coverPic = 'default.jpg';
      state.phoneNo = '';
      state.isSuperAdmin = false;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;

export const userSelector = (state: RootState) => state.user;

export const userIDSelector = (state: RootState) => state.user.id;

export const profilePicSelector = (state: RootState) => state.user.profilePic;
