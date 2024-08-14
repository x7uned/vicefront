import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from './axios'

interface UploadState {
	fileUrl: string | null
	loading: boolean
	error: string | null
}

const initialState: UploadState = {
	fileUrl: null,
	loading: false,
	error: null,
}

export const fetchUploadProduct = createAsyncThunk(
	'upload/fetchUploadProduct',
	async (file: File, thunkAPI) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await axiosInstance.post('/upload/product', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			return response.data.fileUrl
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || 'Failed to upload product'
			)
		}
	}
)

export const fetchUploadAvatar = createAsyncThunk(
	'upload/fetchUploadAvatar',
	async (file: File, thunkAPI) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await axiosInstance.post('/upload/avatar', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			return response.data.fileUrl
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || 'Failed to upload avatar'
			)
		}
	}
)

export const fetchUploadBanner = createAsyncThunk(
	'upload/fetchUploadBanner',
	async (file: File, thunkAPI) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await axiosInstance.post('/upload/banner', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			return response.data.fileUrl
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || 'Failed to upload banner'
			)
		}
	}
)

const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUploadProduct.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchUploadProduct.fulfilled, (state, action) => {
				state.fileUrl = action.payload
				state.loading = false
			})
			.addCase(fetchUploadProduct.rejected, (state, action) => {
				state.error = action.payload as string
				state.loading = false
			})

			.addCase(fetchUploadAvatar.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchUploadAvatar.fulfilled, (state, action) => {
				state.fileUrl = action.payload
				state.loading = false
			})
			.addCase(fetchUploadAvatar.rejected, (state, action) => {
				state.error = action.payload as string
				state.loading = false
			})

			.addCase(fetchUploadBanner.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchUploadBanner.fulfilled, (state, action) => {
				state.fileUrl = action.payload
				state.loading = false
			})
			.addCase(fetchUploadBanner.rejected, (state, action) => {
				state.error = action.payload as string
				state.loading = false
			})
	},
})

export default uploadSlice.reducer
