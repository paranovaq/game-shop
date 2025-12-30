import React, { useState } from "react";
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFromCart, updateCartQuantity, clearCart } from '../store/slices/cartSlice';
import { updateGameStock } from '../store/slices/gamesSlice';
import { logout } from '../store/slices/authSlice';
import Cart from "../Cart";
import ThemeToggle from "./ThemeToggle";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const { user } = useAppSelector((state) => state.auth);
  const { items: cart } = useAppSelector((state) => state.cart);
  const { items: games } = useAppSelector((state) => state.games);
  const { isOnline } = useAppSelector((state) => state.ui);

  // Основные обработчики
  const handleRemoveFromCart = (id) => dispatch(removeFromCart(id));
  
  const handleUpdateQuantity = (id, quantity) => {
    const game = games.find(g => g.id === id);
    if (game && quantity > game.stock) {
      alert(`Only ${game.stock} copies available`);
      return;
    }
    dispatch(updateCartQuantity({ id, quantity }));
  };

  // Подсчеты
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  // Оформление заказа
  const handleCheckout = () => {
    setCheckoutError("");
    
    // Проверка корзины
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Проверка наличия товаров
    for (const item of cart) {
      const game = games.find(g => g.id === item.id);
      if (!game) {
        setCheckoutError(`${item.title} is no longer available`);
        setCheckoutDialogOpen(true);
        return;
      }
      if (item.quantity > game.stock) {
        setCheckoutError(`Only ${game.stock} copies of ${item.title} available`);
        setCheckoutDialogOpen(true);
        return;
      }
    }

    // Все ок - открываем диалог подтверждения
    setCheckoutDialogOpen(true);
  };

  const confirmCheckout = async () => {
    setCheckoutDialogOpen(false);

    try {
      // Обновляем остатки для каждого товара
      for (const item of cart) {
        const game = games.find(g => g.id === item.id);
        if (game) {
          const newStock = game.stock - item.quantity;
          await dispatch(updateGameStock({ id: item.id, stock: newStock })).unwrap();
        }
      }

      // Очищаем корзину
      dispatch(clearCart());
      
      // Показываем успех и возвращаем в магазин
      alert(`🎉 Order completed! Total: $${getTotalPrice()}`);
      navigate('/');
      
    } catch (error) {
      alert("There was an error processing your order");
      console.error(error);
    }
  };

  // Пустая корзина
  if (cart.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Header />
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>🛒 Your Cart is Empty</Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Browse Games
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Диалог подтверждения/ошибки */}
      <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)}>
        <DialogTitle>
          {checkoutError ? "Cannot Checkout" : "Confirm Purchase"}
        </DialogTitle>
        <DialogContent>
          {checkoutError ? (
            <Typography color="error">{checkoutError}</Typography>
          ) : (
            <>
              <Typography>
                Purchase {getTotalItems()} item(s) for <strong>${getTotalPrice()}</strong>?
              </Typography>
              <Box sx={{ mt: 2 }}>
                {cart.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{item.title} × {item.quantity}</Typography>
                    <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)}>
            {checkoutError ? "OK" : "Cancel"}
          </Button>
          {!checkoutError && (
            <Button onClick={confirmCheckout} variant="contained" color="primary">
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Хедер */}
      <Header />

      {/* Корзина */}
      <Cart 
        cart={cart} 
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        onContinueShopping={() => navigate('/')}
        getTotalPrice={getTotalPrice}
        user={user}
        games={games}
      />
    </Box>
  );

  // Компонент хедера
  function Header() {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            🛒 Shopping Cart
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isOnline ? "🟢 Online" : "🔴 Offline"} • {getTotalItems()} items • ${getTotalPrice()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography>Welcome, {user?.username}!</Typography>
          <ThemeToggle />
          <Button variant="outlined" onClick={() => navigate('/')}>
            Store
          </Button>
          <Button variant="contained" color="secondary" onClick={() => { dispatch(logout()); navigate('/login'); }}>
            Logout
          </Button>
        </Box>
      </Box>
    );
  }
};

export default CartPage;