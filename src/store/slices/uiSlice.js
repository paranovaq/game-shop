import { createSlice } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'gameStoreTheme';

// Загружаем тему из localStorage
const loadThemeFromStorage = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme ? JSON.parse(savedTheme) : false;
  } catch (error) {
    console.error('Error loading theme from storage:', error);
    return false;
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: loadThemeFromStorage(),
    isOnline: navigator.onLine,
    isLoading: false,
    notification: null,
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state.darkMode));
    },
    
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    showNotification: (state, action) => {
      state.notification = action.payload;
    },
    
    clearNotification: (state) => {
      state.notification = null;
    },
    
    setTheme: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const {
  toggleTheme,
  setOnlineStatus,
  setLoading,
  showNotification,
  clearNotification,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;