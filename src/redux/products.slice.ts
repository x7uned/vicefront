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

interface Product {
  category: string;
  title: string;
  subtitle?: string;
  image?: string;
  brand: string;
  price: string;
}

interface ProductState {
  products: any[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: null,
  status: 'idle',
  error: null,
};

export const fetchFindPage = createAsyncThunk(
  'products/fetchFindPage',
  async (data: FindPageFetch) => {
    try {
      const response = await axios.get(`products/findPage?page=${data.page}${(data.category) ? `&category=${data.category}`: ''}${(data.brand) ? `&brand=${data.brand}`: ''}${(data.sort) ? `&sort=${data.sort}`: ''}${(data.pricemin) ? `&pricemin=${data.pricemin}`: ''}${(data.pricemax) ? `&pricemax=${data.pricemax}`: ''}`);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
      throw error;
    }
  }
);

export const fetchGetCategories = createAsyncThunk(
  'products/fetchGetCategories',
  async () => {
    try {
      const response = await axios.get(`products/categories`);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
      throw error;
    }
  }
);

export const fetchCreateProduct = createAsyncThunk(
  'products/fetchCreateProduct',
  async (product: Product) => {
    try {
      const response = await axiosInstance.post('products/create', product);
      return response.data;
    } catch (error) {
      console.error('Failed to create product', error);
      throw error;
    }
  }
);

export const fetchGetBrands = createAsyncThunk(
  'products/fetchGetBrands',
  async () => {
    try {
      const response = await axios.get(`products/brands`);
      return response.data;
    } catch (error) {
      console.error('Something went wrong', error);
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFindPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFindPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchFindPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
