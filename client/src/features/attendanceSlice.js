import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

const API_URL = `${import.meta.env.VITE_API_URL}/api/attendance/`;

// Actions
export const checkIn = createAsyncThunk('attendance/checkIn', async (_, thunkAPI) => {
  try {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'checkin', {}, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const checkOut = createAsyncThunk('attendance/checkOut', async (_, thunkAPI) => {
  try {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'checkout', {}, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getMyHistory = createAsyncThunk('attendance/getMyHistory', async (_, thunkAPI) => {
  try {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'my-history', config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// MANAGER: Get Today's Status for ALL employees
export const getTodayAll = createAsyncThunk('attendance/getTodayAll', async (_, thunkAPI) => {
  try {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'today-all', config); // Calling new endpoint
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    history: [], // Stores personal history
    todayStatus: [], // Stores Manager's view of all employees
    isLoading: false,
    message: '',
  },
  reducers: {
    resetAttendance: (state) => {
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
        alert('Checked In Successfully!');
      })
      .addCase(checkIn.rejected, (state, action) => {
        alert(action.payload);
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        const index = state.history.findIndex(x => x._id === action.payload._id);
        if (index !== -1) state.history[index] = action.payload;
        alert('Checked Out Successfully!');
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(getTodayAll.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      });
  },
});

export const { resetAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;