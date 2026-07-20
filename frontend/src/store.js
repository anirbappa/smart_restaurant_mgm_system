import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import menuReducer from './features/menuSlice';
import cartReducer from './features/cartSlice';
import orderReducer from './features/orderSlice';
import reservationReducer from './features/reservationSlice';
import feedbackReducer from './features/feedbackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
    orders: orderReducer,
    reservations: reservationReducer,
    feedback: feedbackReducer,
  },
});
