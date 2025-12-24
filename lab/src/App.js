import './App.css';
import GameAPI from "./api/services";
import Table from "./Table";
import Form from "./Form";
import Login from "./Login";
import Cart from "./Cart";
import { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Typography, Box, Button, IconButton, ThemeProvider, createTheme } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const LOCAL_STORAGE_KEY = "gameStore";
const AUTH_STORAGE_KEY = "auth";
const CART_STORAGE_KEY = "cart";
const THEME_STORAGE_KEY = "theme";

// Компонент для переключения темы
function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <IconButton 
      onClick={toggleTheme} 
      color="inherit"
      sx={{ ml: 1 }}
    >
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

// Создаем отдельный компонент для главной страницы
function MainPage({ user, games, cart, deleteGame, addGame, addToCart, logout, darkMode, toggleTheme }) {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🎮 Game Store
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Welcome, {user.username}!
          </Typography>
          
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          
          <Button
            variant="outlined"
            onClick={() => navigate('/cart')}
            startIcon="🛒"
            sx={{ fontWeight: 'bold' }}
          >
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={logout}
            sx={{ fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Box>
      </div>

      {user.role === 'admin' && (
        <Form handleSubmit={addGame} initialGame={{ 
          title: "", 
          genre: "", 
          releaseDate: "", 
          developer: "", 
          price: "", 
          stock: 0 
        }} />
      )}
      
      <Table 
        games={games} 
        deleteGame={user.role === 'admin' ? deleteGame : null} 
        onAddToCart={addToCart}
        userRole={user.role}
        cart={cart}
      />
    </>
  );
}

// Создаем отдельный компонент для корзины
function CartPage({ cart, onRemove, onUpdateQuantity, onCheckout, getTotalPrice, user, darkMode, toggleTheme, games }) {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          🛒 Shopping Cart
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Welcome, {user.username}!
          </Typography>
          
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ fontWeight: 'bold' }}
          >
            Back to Store
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem(AUTH_STORAGE_KEY);
              localStorage.removeItem(CART_STORAGE_KEY);
              navigate('/login');
            }}
            sx={{ fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      
      <Cart 
        cart={cart} 
        onRemove={onRemove}
        onUpdateQuantity={onUpdateQuantity}
        onCheckout={onCheckout}
        onContinueShopping={() => navigate('/')}
        getTotalPrice={getTotalPrice}
        user={user}
        games={games}
      />
    </>
  );
}

function App() {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Создаем тему - менее темную (серую вместо черной)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#7bb7e3' : '#1976d2',
            light: darkMode ? '#a8d4f5' : '#42a5f5',
            dark: darkMode ? '#4a8bb9' : '#1565c0',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
            light: darkMode ? '#f8c1d5' : '#ff4081',
            dark: darkMode ? '#bf5f82' : '#9a0036',
          },
          background: {
            default: darkMode ? '#2d3748' : '#f5f6fa',
            paper: darkMode ? '#374151' : '#ffffff',
          },
          text: {
            primary: darkMode ? '#f7fafc' : '#1a202c',
            secondary: darkMode ? '#cbd5e0' : '#718096',
          },
          divider: darkMode ? '#4a5568' : '#e2e8f0',
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
            color: darkMode ? '#f7fafc' : '#1a202c',
          },
          h6: {
            fontWeight: 600,
            color: darkMode ? '#e2e8f0' : '#4a5568',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: darkMode ? '#374151' : '#ffffff',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
              },
              contained: {
                boxShadow: darkMode 
                  ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
              },
              outlined: {
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: darkMode ? '#4a5568' : '#e2e8f0',
              },
              head: {
                fontWeight: 700,
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f0f4ff',
                color: darkMode ? '#f7fafc' : '#1a202c',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  useEffect(() => {
    const storedGames = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      const initialGames = GameAPI.all();
      setGames(initialGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialGames));
    }

    if (storedAuth) {
      setUser(JSON.parse(storedAuth));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newMode));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const deleteGame = (id) => {
    if (GameAPI.delete(id)) {
      const updatedGames = games.filter((game) => game.id !== id);
      setGames(updatedGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGames));
      
      const updatedCart = cart.filter(item => item.id !== id);
      if (updatedCart.length !== cart.length) {
        setCart(updatedCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      }
    }
  };

  const addGame = (game) => {
    const gameWithStock = {
      ...game,
      stock: parseInt(game.stock) || 0
    };
    
    const newGame = GameAPI.add(gameWithStock);
    if (newGame) {
      const updatedGames = [...games, newGame];
      setGames(updatedGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGames));
    }
  };

  const addToCart = (game) => {
    const gameInStock = games.find(g => g.id === game.id);
    
    if (!gameInStock) {
      alert("Game not found!");
      return;
    }
    
    const cartItem = cart.find(item => item.id === game.id);
    const currentCartQuantity = cartItem ? cartItem.quantity : 0;
    
    if (currentCartQuantity >= gameInStock.stock) {
      alert(`Sorry! Only ${gameInStock.stock} copies available in stock.`);
      return;
    }
    
    let updatedCart;

    if (cartItem) {
      updatedCart = cart.map(item =>
        item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...game, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    alert(`"${game.title}" added to cart! 🛒 (${currentCartQuantity + 1}/${gameInStock.stock})`);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const gameInStock = games.find(g => g.id === id);
    
    if (gameInStock && quantity > gameInStock.stock) {
      alert(`Sorry! Only ${gameInStock.stock} copies available in stock.`);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const checkout = () => {
    for (const item of cart) {
      const gameInStock = games.find(g => g.id === item.id);
      if (!gameInStock) {
        alert(`"${item.title}" is no longer available!`);
        removeFromCart(item.id);
        return;
      }
      
      if (item.quantity > gameInStock.stock) {
        alert(`Sorry! Only ${gameInStock.stock} copies of "${item.title}" available in stock.`);
        return;
      }
    }
    
    const updatedGames = games.map(game => {
      const cartItemFound = cart.find(item => item.id === game.id);
      if (cartItemFound) {
        return {
          ...game,
          stock: game.stock - cartItemFound.quantity
        };
      }
      return game;
    });
    
    setGames(updatedGames);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGames));
    
    alert(`🎉 Order completed!\n\nTotal: $${getTotalPrice()}\n\nThank you for your purchase!`);
    clearCart();
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App" style={{ 
          padding: '20px', 
          backgroundColor: theme.palette.background.default, 
          minHeight: '100vh',
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
              <Route path="/login" element={
                user ? <Navigate to="/" /> : 
                <div>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
                  </Box>
                  <Login onLogin={login} darkMode={darkMode} toggleTheme={toggleTheme} />
                </div>
              } />
              <Route path="/" element={
                user ? (
                  <MainPage 
                    user={user}
                    games={games}
                    cart={cart}
                    deleteGame={deleteGame}
                    addGame={addGame}
                    addToCart={addToCart}
                    logout={logout}
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              } />
              <Route path="/cart" element={
                user ? (
                  <CartPage
                    cart={cart}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateCartQuantity}
                    onCheckout={checkout}
                    getTotalPrice={getTotalPrice}
                    user={user}
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    games={games}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;