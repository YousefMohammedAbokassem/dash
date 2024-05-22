import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { headerApi } from 'src/utils/headerApi';

const admin = localStorage.getItem('admin');


const initialState = {
  place: {},
};

const placeReducer = createSlice({
  name: 'place',
  initialState,
  reducers: {
    changeError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { changeError, updateProfile, logoutUser } = placeReducer.actions;
export default placeReducer.reducer;
