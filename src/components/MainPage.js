import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addGame, deleteGame } from '../store/slices/gamesSlice';
import { addToCart } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import Table from "../Table";
import Form from "../Form";
import ThemeToggle from "./ThemeToggle";

const Chip = ({ label, color, size, sx }) => {
  const getColor = () => {
    switch(color) {
      case 'success': return '#2ecc71';
      case 'warning': return '#f39c12';
      case 'error': return '#e74c3c';
      default: return '#3498db';
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: getColor(),
        color: 'white',
        padding: size === 'small' ? '2px 8px' : '4px 12px',
        borderRadius: '16px',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        ...sx
      }}
    >
      {label}
    </Box>
  );
};

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { items: games, loading: gamesLoading } = useAppSelector((state) => state.games);
  const { items: cart } = useAppSelector((state) => state.cart);
  const { isOnline } = useAppSelector((state) => state.ui);

  const handleDeleteGame = (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      dispatch(deleteGame(id));
    }
  };

  const handleAddGame = (game) => {
    dispatch(addGame(game));
  };

  const handleAddToCart = (game) => {
    dispatch(addToCart(game));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🎮 Game Store
          </Typography>
          <Chip 
            label={isOnline ? "Online" : "Offline"} 
            color={isOnline ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          {gamesLoading && (
            <Chip 
              label="Loading..." 
              color="warning"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Welcome, {user?.username}! ({user?.role})
          </Typography>
          
          <ThemeToggle />
          
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
            onClick={handleLogout}
            sx={{ fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Box>
      </div>

      {user?.role === 'admin' && (
        <Form handleSubmit={handleAddGame} initialGame={{ 
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
        deleteGame={user?.role === 'admin' ? handleDeleteGame : null} 
        onAddToCart={handleAddToCart}
        userRole={user?.role}
        cart={cart}
      />
    </>
  );
};

export default MainPage;