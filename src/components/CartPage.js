// src/components/CartPage.js
import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  removeFromCart, 
  updateCartQuantity, 
  clearCart 
} from '../store/slices/cartSlice';
import { 
  updateGameStock, 
  updateStockLocally 
} from '../store/slices/gamesSlice';
import { logout } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import Cart from "../Cart";
import ThemeToggle from "./ThemeToggle";

// Компонент Chip для отображения статуса
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

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Состояние для UI
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Получаем данные из Redux
  const { user } = useAppSelector((state) => state.auth);
  const { items: cart } = useAppSelector((state) => state.cart);
  const { items: games } = useAppSelector((state) => state.games);
  const { isOnline } = useAppSelector((state) => state.ui);

  // Обработчики для корзины
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    showSnackbar("Item removed from cart", "info");
  };

  const handleUpdateQuantity = (id, quantity) => {
    const game = games.find(g => g.id === id);
    if (game && quantity > game.stock) {
      showSnackbar(`Only ${game.stock} copies available in stock`, "warning");
      return;
    }
    dispatch(updateCartQuantity({ id, quantity }));
  };

  // Показ уведомлений
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    dispatch(showNotification({ message, severity }));
  };

  // Подсчет общей стоимости
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  // Подсчет общего количества товаров
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
  };

  // Проверка возможности оформления заказа
  const validateCheckout = () => {
    if (cart.length === 0) {
      showSnackbar("Your cart is empty!", "warning");
      return false;
    }

    const validationErrors = [];

    cart.forEach(item => {
      const game = games.find(g => g.id === item.id);
      
      if (!game) {
        validationErrors.push(`"${item.title}" is no longer available`);
        return;
      }

      const requestedQuantity = parseInt(item.quantity) || 0;
      const availableStock = parseInt(game.stock) || 0;

      if (requestedQuantity > availableStock) {
        validationErrors.push(`Only ${availableStock} copies of "${item.title}" available`);
      }
    });

    if (validationErrors.length > 0) {
      showSnackbar(validationErrors.join(". "), "error");
      return false;
    }

    return true;
  };

  // Оформление заказа
  const handleCheckout = async () => {
    if (!validateCheckout()) {
      return;
    }

    setCheckoutDialogOpen(true);
  };

  // Подтверждение оформления заказа
  const confirmCheckout = async () => {
    setCheckoutDialogOpen(false);
    setIsProcessing(true);

    try {
      // Создаем список обновлений
      const updates = cart.map(item => {
        const game = games.find(g => g.id === item.id);
        if (game) {
          const requestedQuantity = parseInt(item.quantity) || 0;
          const currentStock = parseInt(game.stock) || 0;
          const newStock = Math.max(0, currentStock - requestedQuantity);
          
          return {
            id: item.id,
            title: game.title,
            quantity: requestedQuantity,
            newStock,
            currentStock
          };
        }
        return null;
      }).filter(update => update !== null);

      // Обновляем локально для мгновенного отклика
      updates.forEach(update => {
        dispatch(updateStockLocally({
          id: update.id,
          stock: update.newStock
        }));
      });

      // Обновляем через API (асинхронно)
      const apiPromises = updates.map(update =>
        dispatch(updateGameStock({
          id: update.id,
          stock: update.newStock
        }))
      );

      await Promise.all(apiPromises);

      // Показываем успешное сообщение
      showSnackbar(
        `🎉 Order completed! ${getTotalItems()} items for $${getTotalPrice()}. Thank you!`,
        "success"
      );

      // Очищаем корзину
      dispatch(clearCart());

      // Через 2 секунды возвращаем в магазин
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Checkout error:', error);
      showSnackbar("There was an error processing your order. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  // Если корзина пуста
  if (cart.length === 0) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🛒 Shopping Cart
            </Typography>
            <Chip 
              label={isOnline ? "Online" : "Offline"} 
              color={isOnline ? "success" : "warning"}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Welcome, {user?.username}! ({user?.role})
            </Typography>
            
            <ThemeToggle />
            
            <Button
              variant="outlined"
              onClick={handleContinueShopping}
              sx={{ fontWeight: 'bold' }}
            >
              Back to Store
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
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center',
            p: 4
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
            🛒 Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Add some amazing games to your cart and they will appear here!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinueShopping}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5 }}
          >
            Start Shopping
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Загрузочный индикатор */}
      {isProcessing && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography variant="h6">
              Processing your order...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Диалог подтверждения заказа */}
      <Dialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Purchase
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to purchase {getTotalItems()} item(s) for a total of <strong>${getTotalPrice()}</strong>.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Order Summary:
            </Typography>
            {cart.map(item => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  {item.title} × {item.quantity}
                </Typography>
                <Typography variant="body2">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmCheckout} 
            variant="contained" 
            color="primary"
            autoFocus
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Основной контент */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🛒 Shopping Cart
          </Typography>
          <Chip 
            label={isOnline ? "Online" : "Offline"} 
            color={isOnline ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip 
            label={`${getTotalItems()} items`} 
            color="info"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Welcome, {user?.username}! ({user?.role})
          </Typography>
          
          <ThemeToggle />
          
          <Button
            variant="outlined"
            onClick={handleContinueShopping}
            sx={{ fontWeight: 'bold' }}
          >
            Continue Shopping
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
      </Box>
      
      <Cart 
        cart={cart} 
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        onContinueShopping={handleContinueShopping}
        getTotalPrice={getTotalPrice}
        user={user}
        games={games}
      />
    </>
  );
};

export default CartPage;