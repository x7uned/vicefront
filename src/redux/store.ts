import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user.slice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;