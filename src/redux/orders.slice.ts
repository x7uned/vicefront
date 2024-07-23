import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from './axios';
import axiosInstance from './axios';

interface FindPageFetch {
  page: number;
  category: string | null;
  brand: string | null;
  sort: string | null;
  pricemin: string | null;
  pricemax: string | null;
}

interface OrdersState {
  products: any[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  products: null,
  status: 'idle',
  error: null,
};

export interface OrderFetchData {
  firstname: string;
  secondname?: string | undefined;
  surname: string;
  cart: Object[];
  number: string;
  email: string;
  postname: 'meest' | 'uapost' | 'novapost' | 'self';
  address: string;
  paymentmethod: 'creditcard' | 'paypal' | 'onreceipt' | 'monopay' | 'applepay';
  comment?: string | undefined;
}

export const fetchCreateOrder = createAsyncThunk(
  'orders/fetchCreateOrder',
  async (data: OrderFetchData) => {
    try {
      const response = await axiosInstance.post(`orders/create`, data);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
      throw error;
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCreateOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchCreateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create order';
      });
  },
});

export default ordersSlice.reducer;
