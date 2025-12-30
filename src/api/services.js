const LOCAL_STORAGE_KEY = "gameStoreGames";

// Инициализируем игры из localStorage или используем начальные данные
const getInitialGames = () => {
  try {
    const savedGames = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedGames) {
      return JSON.parse(savedGames);
    }
  } catch (error) {
    console.error('Error loading games from localStorage:', error);
  }
  
  // Начальные данные, если в localStorage ничего нет
  return [
  ];
};

const GameAPI = {
  games: getInitialGames(),
  
  // Сохранить игры в localStorage
  saveGames: function() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.games));
    } catch (error) {
      console.error('Error saving games to localStorage:', error);
    }
  },
  
  all: async function () {
    try {
      // Для совместимости с API - всегда возвращаем актуальные данные
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...this.games]);
        }, 100);
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      return [...this.games];
    }
  },

  get: async function (id) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const game = this.games.find(p => p.id === id);
          resolve(game || null);
        }, 100);
      });
    } catch (error) {
      console.error(`Error fetching game ${id}:`, error);
      return this.games.find(p => p.id === id);
    }
  },

  delete: async function (id) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const initialLength = this.games.length;
          this.games = this.games.filter(game => game.id !== id);
          this.saveGames(); // Сохраняем изменения
          resolve(this.games.length < initialLength);
        }, 200);
      });
    } catch (error) {
      console.error(`Error deleting game ${id}:`, error);
      const initialLength = this.games.length;
      this.games = this.games.filter(game => game.id !== id);
      this.saveGames(); // Сохраняем изменения
      return this.games.length < initialLength;
    }
  },

  add: async function (game) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Генерируем новый ID
          const newId = this.games.length > 0 
            ? Math.max(...this.games.map(g => g.id)) + 1 
            : 1;
          
          const newGame = {
            ...game,
            id: newId,
            price: parseFloat(game.price) || 0,
            stock: parseInt(game.stock) || 0
          };
          
          this.games.push(newGame);
          this.saveGames(); // Сохраняем изменения
          resolve(newGame);
        }, 300);
      });
    } catch (error) {
      console.error('Error adding game:', error);
      
      const newId = this.games.length > 0 
        ? Math.max(...this.games.map(g => g.id)) + 1 
        : 1;
      
      const newGame = {
        ...game,
        id: newId,
        price: parseFloat(game.price) || 0,
        stock: parseInt(game.stock) || 0
      };
      
      this.games.push(newGame);
      this.saveGames(); // Сохраняем изменения
      return newGame;
    }
  },

  update: async function (game) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = this.games.findIndex(g => g.id === game.id);
          if (index !== -1) {
            this.games[index] = { 
              ...game, 
              price: parseFloat(game.price) || 0,
              stock: parseInt(game.stock) || 0 
            };
            this.saveGames(); // Сохраняем изменения
            resolve(this.games[index]);
          } else {
            resolve(null);
          }
        }, 200);
      });
    } catch (error) {
      console.error(`Error updating game ${game.id}:`, error);
      const index = this.games.findIndex(g => g.id === game.id);
      if (index !== -1) {
        this.games[index] = game;
        this.saveGames(); // Сохраняем изменения
      }
      return game;
    }
  },

  // Новый метод для обновления количества товара после покупки
updateStock: async function (id, stock) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.games.findIndex(g => g.id === id);
        if (index !== -1) {
          this.games[index] = {
            ...this.games[index],
            stock: Math.max(0, parseInt(stock) || 0)
          };
          this.saveGames(); // Сохраняем изменения
          resolve(this.games[index]);
        } else {
          resolve(null);
        }
      }, 200);
    });
  } catch (error) {
    console.error(`Error updating stock for game ${id}:`, error);
    const index = this.games.findIndex(g => g.id === id);
    if (index !== -1) {
      this.games[index].stock = Math.max(0, parseInt(stock) || 0);
      this.saveGames();
    }
    return null;
  }
}
};

export default GameAPI;