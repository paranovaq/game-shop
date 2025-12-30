import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthAPI from '../../api/auth';

const AUTH_STORAGE_KEY = 'gameStoreAuth';

// Асинхронный thunk для логина
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const user = await AuthAPI.login(username, password);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Загружаем данные из localStorage
const loadAuthFromStorage = () => {
  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return savedAuth ? JSON.parse(savedAuth) : null;
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadAuthFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('token');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
        
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;