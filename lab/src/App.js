import './App.css';
import GameAPI from "./api/services";
import Table from "./Table";
import Form from "./Form";
import Login from "./Login";
import Cart from "./Cart";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";

const LOCAL_STORAGE_KEY = "gameStore";
const AUTH_STORAGE_KEY = "auth";
const CART_STORAGE_KEY = "cart";

// Создаем отдельный компонент для главной страницы
function MainPage({ user, games, cart, deleteGame, addGame, addToCart, logout }) {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🎮 Game Store
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#2d3436' }}>
            Welcome, {user.username}!
          </Typography>
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
        <Form handleSubmit={addGame} initialGame={{ title: "", genre: "", releaseDate: "", developer: "", price: "" }} />
      )}
      
      <Table 
        games={games} 
        deleteGame={user.role === 'admin' ? deleteGame : null} 
        onAddToCart={addToCart}
        userRole={user.role}
      />
    </>
  );
}

// Создаем отдельный компонент для корзины
function CartPage({ cart, onRemove, onUpdateQuantity, onCheckout, getTotalPrice, user }) {
  const navigate = useNavigate();

  return (
    <Cart 
      cart={cart} 
      onRemove={onRemove}
      onUpdateQuantity={onUpdateQuantity}
      onCheckout={onCheckout}
      onContinueShopping={() => navigate('/')}
      getTotalPrice={getTotalPrice}
      user={user}
    />
  );
}

function App() {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

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
    }
  };

  const addGame = (game) => {
    const newGame = GameAPI.add(game);
    if (newGame) {
      const updatedGames = [...games, newGame];
      setGames(updatedGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGames));
    }
  };

  const addToCart = (game) => {
    const existingItem = cart.find(item => item.id === game.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...game, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
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
    alert(`🎉 Order completed!\n\nTotal: $${getTotalPrice()}\n\nThank you for your purchase!`);
    clearCart();
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <Router>
      <div className="App" style={{ padding: '20px', backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login onLogin={login} />
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
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;