import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axios';

interface UploadState {
  fileUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UploadState = {
  fileUrl: null,
  loading: false,
  error: null,
};

export const fetchUploadImage = createAsyncThunk(
  'product/uploadImage',
  async (file: File, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.fileUrl;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to upload image');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUploadImage.fulfilled, (state, action) => {
        state.fileUrl = action.payload;
        state.loading = false;
      })
      .addCase(fetchUploadImage.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
