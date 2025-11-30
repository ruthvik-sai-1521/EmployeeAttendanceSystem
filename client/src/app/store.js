import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import attendanceReducer from '../features/attendanceSlice'; // Import it

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer, // Add it here
  },
});