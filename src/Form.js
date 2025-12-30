import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Divider,
  MenuItem,
  InputAdornment,
  useTheme,
} from "@mui/material";

const Form = ({ handleSubmit, initialGame }) => {
  const [game, setGame] = useState(initialGame);
  const theme = useTheme();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGame({ ...game, [name]: name === 'stock' || name === 'price' ? (parseFloat(value) || 0) : value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(game);
    setGame(initialGame);
  };

  const genres = [
    "RPG",
    "Action RPG",
    "Action",
    "Action-adventure",
    "Adventure",
    "Shooter",
    "Strategy",
    "Sports",
    "Racing",
    "Horror",
    "Simulation",
    "Puzzle",
    "MMO",
    "Indie",
    "FMV"
  ];

  const gradient = theme.palette.mode === 'dark' 
    ? "linear-gradient(135deg, #2c3e50 0%, #4a148c 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const inputBackground = theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.95)';

  const inputTextColor = theme.palette.mode === 'dark' ? 'white' : '#2d3748';
  const labelColor = theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : '#462020ff';

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          opacity: 0.3,
          zIndex: 1,
        }
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: "bold",
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 2,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          mb: 2
        }}
      >
        🎮 Add New Game
      </Typography>
      <Divider sx={{ 
        mb: 3, 
        backgroundColor: 'rgba(255,255,255,0.3)',
        position: 'relative',
        zIndex: 2 
      }} />
      <Box component="form" onSubmit={onSubmit} sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Game Title */}
          <Grid item xs={12} sm={2.3}>
            <TextField
              fullWidth
              label="Game Title"
              name="title"
              value={game.title}
              onChange={handleChange}
              variant="filled"
              size="small"
              required
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground,
                  borderRadius: 1.5,
                  color: inputTextColor,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              InputLabelProps={{
                sx: { 
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&.Mui-focused': {
                    color: '#ffffff',
                    fontWeight: 700,
                  }
                }
              }}
            />
          </Grid>

          {/* Genre */}
          <Grid item xs={12} sm={1.7}>
            <TextField
              fullWidth
              select
              label="Genre"
              name="genre"
              value={game.genre}
              onChange={handleChange}
              variant="filled"
              size="small"
              required
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground,
                  borderRadius: 1.5,
                  color: inputTextColor,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              InputLabelProps={{
                sx: { 
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&.Mui-focused': {
                    color: '#ffffff',
                    fontWeight: 700,
                  }
                }
              }}
            >
              {genres.map((genre) => (
                <MenuItem 
                  key={genre} 
                  value={genre}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : '#2d3748',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(102, 126, 234, 0.3)' 
                        : 'rgba(102, 126, 234, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(102, 126, 234, 0.5)' 
                        : 'rgba(102, 126, 234, 0.2)',
                      fontWeight: 600,
                    }
                  }}
                >
                  {genre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Stock Quantity */}
          <Grid item xs={12} sm={1.4}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={game.stock || 0}
              onChange={handleChange}
              variant="filled"
              size="small"
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground,
                  borderRadius: 1.5,
                  color: inputTextColor,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              InputLabelProps={{
                sx: { 
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&.Mui-focused': {
                    color: '#ffffff',
                    fontWeight: 700,
                  }
                }
              }}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Release Date */}
          <Grid item xs={12} sm={1.6}>
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={game.releaseDate}
              onChange={handleChange}
              variant="filled"
              size="small"
              InputLabelProps={{ 
                shrink: true,
                sx: { 
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&.Mui-focused': {
                    color: '#ffffff',
                    fontWeight: 700,
                  }
                }
              }}
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground,
                  borderRadius: 1.5,
                  color: inputTextColor,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              required
            />
          </Grid>

          {/* Developer */}
          <Grid item xs={12} sm={1.6}>
            <TextField
              fullWidth
              label="Developer"
              name="developer"
              value={game.developer}
              onChange={handleChange}
              variant="filled"
              size="small"
              required
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground,
                  borderRadius: 1.5,
                  color: inputTextColor,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              InputLabelProps={{
                sx: { 
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&.Mui-focused': {
                    color: '#ffffff',
                    fontWeight: 700,
                  }
                }
              }}
            />
          </Grid>

          

          {/* Price */}
          <Grid item xs={12} sm={1.4}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={game.price}
              onChange={handleChange}
              variant="filled"
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: labelColor, fontWeight: 600 }}>$</InputAdornment>,
                sx: { 
                  backgroundColor: inputBackground,
                  borderRadius: 1.5,
                  color: inputTextColor,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              InputLabelProps={{
                sx: { 
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&.Mui-focused': {
                    color: '#ffffff',
                    fontWeight: 700,
                  }
                }
              }}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ 
                  py: 1.5,
                  px: 10,  
                  fontSize: "1.1rem", 
                  fontWeight: "bold",
                  background: 'linear-gradient(45deg, #00b894, #00a085)',
                  borderRadius: 2,
                  boxShadow: '0 4px 15px rgba(0, 184, 148, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00a085, #008b74)',
                    boxShadow: '0 6px 20px rgba(0, 184, 148, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  height: '56px' // Высота как у TextField
                }}
                startIcon="➕"
              >
                Add Game
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                sx={{ 
                  py: 1.5,
                  px: 10,  
                  fontSize: "1.1rem", 
                  fontWeight: "bold",
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    boxShadow: '0 0 15px rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                  height: '56px' // Высота как у TextField
                }}
                onClick={() => setGame(initialGame)}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Form;