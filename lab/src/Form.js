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
} from "@mui/material";

const Form = ({ handleSubmit, initialGame }) => {
  const [game, setGame] = useState(initialGame);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGame({ ...game, [name]: value });
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
    "Adventure",
    "Shooter",
    "Strategy",
    "Sports",
    "Racing",
    "Horror",
    "Simulation",
    "Puzzle",
    "MMO",
    "Indie"
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: 'white'
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: "bold",
          textAlign: 'center',
          color: 'white'
        }}
      >
        🎮 Add New Game
      </Typography>
      <Divider sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.3)' }} />
      <Box component="form" onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Game Title"
              name="title"
              value={game.title}
              onChange={handleChange}
              variant="filled"
              size="medium"
              required
              InputProps={{
                sx: { backgroundColor: 'white', borderRadius: 1 }
              }}
              InputLabelProps={{
                sx: { color: 'white' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Genre"
              name="genre"
              value={game.genre}
              onChange={handleChange}
              variant="filled"
              size="medium"
              required
              InputProps={{
                sx: { backgroundColor: 'white', borderRadius: 1 }
              }}
              InputLabelProps={{
                sx: { color: 'white' }
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={game.releaseDate}
              onChange={handleChange}
              variant="filled"
              size="medium"
              InputLabelProps={{ 
                shrink: true,
                sx: { color: 'white' }
              }}
              InputProps={{
                sx: { backgroundColor: 'white', borderRadius: 1 }
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Developer"
              name="developer"
              value={game.developer}
              onChange={handleChange}
              variant="filled"
              size="medium"
              required
              InputProps={{
                sx: { backgroundColor: 'white', borderRadius: 1 }
              }}
              InputLabelProps={{
                sx: { color: 'white' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={game.price}
              onChange={handleChange}
              variant="filled"
              size="medium"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                sx: { backgroundColor: 'white', borderRadius: 1 }
              }}
              InputLabelProps={{
                sx: { color: 'white' }
              }}
              required
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ 
              py: 1.5, 
              fontSize: "1.1rem", 
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #00b894, #00a085)',
              borderRadius: 2
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
              fontSize: "1.1rem", 
              fontWeight: "bold",
              borderColor: 'white',
              color: 'white',
              borderRadius: 2,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            onClick={() => setGame(initialGame)}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Form;