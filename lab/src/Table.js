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
} from "@mui/material";

const Table = ({ games, deleteGame, onAddToCart, userRole }) => {
  const handleBuy = (game) => {
    onAddToCart(game);
    alert(`"${game.title}" added to cart! 🛒`);
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

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
      }}
    >
      <Typography
        variant="h5"
        sx={{ p: 2, fontWeight: "bold", backgroundColor: "#1976d2", color: "#fff" }}
      >
        🎯 Game Store Catalog
      </Typography>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f4ff" }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Release Date</strong></TableCell>
              <TableCell><strong>Developer</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game, index) => (
              <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                <TableCell>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2d3436' }}>
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
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontStyle: 'italic', color: '#636e72' }}>
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
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleBuy(game)}
                      startIcon="🛒"
                      sx={{ 
                        minWidth: '100px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #00b894, #00a085)'
                      }}
                    >
                      Add to Cart
                    </Button>
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
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
};

export default Table;