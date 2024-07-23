import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from './axios';

const initialState = {
  user: null,
};

export interface SignUpFetch {
  email: string,
  username: string,
  password: string,
}

export interface SignInFetch {
  email: string,
  password: string,
}

export interface ConfirmFetch {
  userId: string,
  confirmationCode: string
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const fetchSignUp = createAsyncThunk(
  'user/fetchSignUp',
  async (userData: SignUpFetch) => {
    try {
      const response = await axios.post('auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
    }
  }
);

interface fetchFindUserInterface {
  id: string;
}

export const fetchFindUser = createAsyncThunk(
  'user/fetchFindUser',
  async (data: fetchFindUserInterface) => {
    try {
      const response = await axios.get(`auth/findUser?id=${data.id}`);
      return response.data;
    } catch (error) {
      console.error('Something went wrong #findUser', error);
    }
  }
)

export const fetchSignIn = createAsyncThunk(
  'user/fetchSignIn',
  async (userData: SignInFetch) => {
    try {
      const response = await axios.post('auth/login', userData);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
    }
  }
);

export const fetchConfirm = createAsyncThunk(
  'user/fetchConfirm',
  async (userData: ConfirmFetch) => {
    try {
      const response = await axios.post('auth/confirm', userData);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
    }
  }
);

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;