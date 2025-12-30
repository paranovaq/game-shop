import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'gameStoreCart';

// Загружаем корзину из localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const game = action.payload;
      const existingItem = state.items.find(item => item.id === game.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...game, quantity: 1 });
      }
      
      // Сохраняем в localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    
    removeFromCart: (state, action) => {
      const gameId = action.payload;
      state.items = state.items.filter(item => item.id !== gameId);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_STORAGE_KEY);
    },
    
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;