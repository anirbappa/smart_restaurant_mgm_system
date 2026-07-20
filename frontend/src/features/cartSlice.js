import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of { menuItem (id), name, price, quantity }
  totalAmount: 0,
  totalItems: 0,
  tableNumber: '',
  diningOption: 'Dine-In',
  notes: ''
};

const calculateTotals = (state) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { _id, name, price } = action.payload;
      const existingItem = state.items.find(item => item.menuItem === _id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          menuItem: _id,
          name,
          price,
          quantity: 1
        });
      }
      calculateTotals(state);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.menuItem !== id);
      calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.menuItem === id);

      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      }
      calculateTotals(state);
    },
    setTableNumber: (state, action) => {
      state.tableNumber = action.payload;
    },
    setDiningOption: (state, action) => {
      state.diningOption = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.tableNumber = '';
      state.diningOption = 'Dine-In';
      state.notes = '';
    }
  }
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setTableNumber,
  setDiningOption,
  setNotes,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
