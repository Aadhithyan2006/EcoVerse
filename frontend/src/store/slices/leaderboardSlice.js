import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async () => {
  const { data } = await api.get('/leaderboard');
  return data;
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.loading = true; })
      .addCase(fetchLeaderboard.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; });
  },
});

export default leaderboardSlice.reducer;
