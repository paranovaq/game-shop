import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import GameAPI from '../../api/services';

// Асинхронные thunks
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async () => {
    const games = await GameAPI.all();
    return games;
  }
);

export const addGame = createAsyncThunk(
  'games/addGame',
  async (gameData) => {
    const newGame = await GameAPI.add(gameData);
    return newGame;
  }
);

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (gameId) => {
    await GameAPI.delete(gameId);
    return gameId;
  }
);

export const updateGameStock = createAsyncThunk(
  'games/updateStock',
  async ({ id, stock }) => {
    await GameAPI.updateStock(id, stock);
    return { id, stock };
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearGames: (state) => {
      state.items = [];
    },
    setGames: (state, action) => {
      state.items = action.payload;
    },
    // Новый синхронный reducer для обновления stock
    updateStockLocally: (state, action) => {
      const { id, stock } = action.payload;
      const index = state.items.findIndex(g => g.id === id);
      if (index !== -1) {
        // Правильное обновление через создание нового объекта
        state.items[index] = {
          ...state.items[index],
          stock: stock
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Game
      .addCase(addGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGame.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Game
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.loading = false;
        // Правильное удаление через filter
        state.items = state.items.filter(game => game.id !== action.payload);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Stock
      .addCase(updateGameStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGameStock.fulfilled, (state, action) => {
        state.loading = false;
        const { id, stock } = action.payload;
        const index = state.items.findIndex(g => g.id === id);
        if (index !== -1) {
          // ПРАВИЛЬНОЕ ОБНОВЛЕНИЕ: создаем новый объект
          state.items[index] = {
            ...state.items[index],
            stock: stock
          };
        }
      })
      .addCase(updateGameStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGames, setGames, updateStockLocally } = gamesSlice.actions;
export default gamesSlice.reducer;