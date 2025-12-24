import React from "react";
import {
  Table as MuiTable,
  TableContainer,
  Button,
  TableBody,
  TableRow,
  TableHead,
  Paper,
  TableCell,
  Typography,
  Box,
  Chip,
  useTheme,
  Tooltip,
} from "@mui/material";

const Table = ({ games, deleteGame, onAddToCart, userRole, cart }) => {
  const theme = useTheme();

  const handleBuy = (game) => {
    onAddToCart(game);
  };

  const getGenreColor = (genre) => {
    const genreColors = {
      'RPG': '#ff6b6b',
      'Action RPG': '#4ecdc4',
      'Action': '#45b7d1',
      'Adventure': '#96ceb4',
      'Shooter': '#feca57',
      'Strategy': '#ff9ff3',
      'Sports': '#54a0ff',
      'Racing': '#5f27cd',
      'Horror': '#222f3e',
      'Simulation': '#ff9f43',
      'Puzzle': '#a29bfe',
      'MMO': '#fd79a8',
      'Indie': '#00cec9'
    };
    return genreColors[genre] || '#8395a7';
  };

  const getStockColor = (stock) => {
    if (stock === 0) return '#ff4757';
    if (stock <= 5) return '#ffa502';
    return '#2ed573';
  };

  const gradient = theme.palette.mode === 'dark'
    ? "linear-gradient(to right, #2c3e50, #4a6491)"
    : "linear-gradient(to right, #e0eafc, #cfdef3)";

  const headerBgColor = theme.palette.mode === 'dark' ? '#1a237e' : '#1976d2';
  const rowHoverColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa';

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: gradient,
      }}
    >
      <Typography
        variant="h5"
        sx={{ 
          p: 2, 
          fontWeight: "bold", 
          backgroundColor: headerBgColor, 
          color: "#fff" 
        }}
      >
        🎯 Game Store Catalog
      </Typography>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f4ff' 
            }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Release Date</strong></TableCell>
              <TableCell><strong>Developer</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game, index) => {
              const cartItem = cart.find(item => item.id === game.id);
              const availableInCart = cartItem ? game.stock - cartItem.quantity : game.stock;
              
              // Переменная cartItem теперь используется в вычислении availableInCart
              return (
                <TableRow 
                  key={index} 
                  hover 
                  sx={{ 
                    '&:hover': { backgroundColor: rowHoverColor },
                    backgroundColor: theme.palette.background.paper
                  }}
                >
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      🎮 {game.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={game.genre} 
                      sx={{ 
                        backgroundColor: getGenreColor(game.genre),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={game.releaseDate} 
                      variant="outlined"
                      sx={{ 
                        fontWeight: 'bold',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : '#1976d2',
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'inherit'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ 
                      fontStyle: 'italic', 
                      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : '#636e72' 
                    }}>
                      {game.developer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#00b894',
                        textShadow: '0px 0px 10px rgba(0,184,148,0.3)'
                      }}
                    >
                      ${game.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${availableInCart} in stock`}
                      sx={{ 
                        backgroundColor: getStockColor(availableInCart),
                        color: 'white',
                        fontWeight: 'bold',
                        width: '120px'
                      }}
                    />
                    {cartItem && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          color: theme.palette.mode === 'dark' ? '#a4b0be' : '#57606f',
                          mt: 0.5
                        }}
                      >
                        {cartItem.quantity} in your cart
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Tooltip 
                        title={availableInCart === 0 ? "Out of stock" : `Add to cart (${availableInCart} available)`}
                      >
                        <span>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleBuy(game)}
                            disabled={availableInCart === 0}
                            startIcon="🛒"
                            sx={{ 
                              minWidth: '100px',
                              fontWeight: 'bold',
                              background: availableInCart === 0 
                                ? '#95a5a6' 
                                : 'linear-gradient(45deg, #00b894, #00a085)',
                              opacity: availableInCart === 0 ? 0.6 : 1,
                            }}
                          >
                            {availableInCart === 0 ? 'Sold Out' : 'Add to Cart'}
                          </Button>
                        </span>
                      </Tooltip>
                      {userRole === 'admin' && (
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => deleteGame(game.id)}
                          startIcon="🗑️"
                          sx={{ 
                            minWidth: '100px',
                            fontWeight: 'bold'
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
};

export default Table;