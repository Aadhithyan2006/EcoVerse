import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchLessons = createAsyncThunk('lessons/fetch', async (params = {}) => {
  const { data } = await api.get('/lessons', { params });
  return data;
});

const lessonSlice = createSlice({
  name: 'lessons',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => { state.loading = true; })
      .addCase(fetchLessons.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchLessons.rejected, (state, { error }) => { state.loading = false; state.error = error.message; });
  },
});

export default lessonSlice.reducer;
