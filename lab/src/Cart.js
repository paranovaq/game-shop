import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Divider,
  useTheme,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = ({ cart, onRemove, onUpdateQuantity, onCheckout, onContinueShopping, getTotalPrice, user }) => {
  const theme = useTheme();

  if (cart.length === 0) {
    return (
      <Paper elevation={4} sx={{ 
        p: 4, 
        borderRadius: 3, 
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
          🛒 Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Add some games to your cart to see them here!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onContinueShopping}
          sx={{ fontWeight: 'bold' }}
        >
          Continue Shopping
        </Button>
      </Paper>
    );
  }

  const headerBgColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f4ff';
  const rowHoverColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa';

  return (
    <Paper elevation={4} sx={{ 
      p: 4, 
      borderRadius: 3,
      backgroundColor: theme.palette.background.paper
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: theme.palette.primary.main 
      }}>
        🛒 Shopping Cart
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: headerBgColor }}>
              <TableCell><strong>Game</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow 
                key={item.id}
                sx={{ 
                  '&:hover': { backgroundColor: rowHoverColor },
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <TableCell>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    🎮 {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.genre} • {item.developer}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ color: '#00b894', fontWeight: 'bold' }}>
                    ${item.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      sx={{ color: 'text.primary' }}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      size="small"
                      sx={{ width: 60 }}
                      inputProps={{ 
                        style: { 
                          textAlign: 'center',
                          color: theme.palette.text.primary
                        },
                        min: 1
                      }}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      sx={{ color: 'text.primary' }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => onRemove(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Total: ${getTotalPrice()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onContinueShopping}
            sx={{ fontWeight: 'bold' }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onCheckout}
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00b894, #00a085)'
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Cart;