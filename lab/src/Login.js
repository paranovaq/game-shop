import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  IconButton,
  useTheme,
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Компонент для переключения темы в Login
function ThemeToggle({ darkMode, toggleTheme }) {
  const theme = useTheme();
  
  return (
    <IconButton 
      onClick={toggleTheme} 
      color="inherit"
      sx={{ 
        position: 'absolute', 
        top: 20, 
        right: 20,
        color: theme.palette.mode === 'dark' ? 'white' : 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

const Login = ({ onLogin, darkMode, toggleTheme }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const theme = useTheme();

  const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Invalid username or password");
    }
  };

  const gradient = theme.palette.mode === 'dark' 
    ? "linear-gradient(135deg, #2c3e50 0%, #4a148c 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const inputBackground = theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'white';

  const inputTextColor = theme.palette.mode === 'dark' ? 'white' : 'inherit';

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: 'relative',
        }}
      >
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: gradient,
            color: "white",
            width: "100%",
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(4px)',
            border: theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.18)'
              : 'none',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🎮 Game Store Login
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(211, 47, 47, 0.9)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              variant="filled"
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground, 
                  borderRadius: 1,
                  color: inputTextColor,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.9)',
                  }
                },
              }}
              InputLabelProps={{
                sx: { 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 1)',
                  }
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              variant="filled"
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground, 
                  borderRadius: 1,
                  color: inputTextColor,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.9)',
                  }
                },
              }}
              InputLabelProps={{
                sx: { 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 1)',
                  }
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #00b894, #00a085)",
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(0, 184, 148, 0.3)',
                '&:hover': {
                  background: "linear-gradient(45deg, #00a085, #008b74)",
                  boxShadow: '0 6px 20px rgba(0, 184, 148, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ 
            mt: 2, 
            color: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: 2,
          }}>
            <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
              Demo Accounts:
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 0.5 }}>
              👑 Admin: <strong>admin</strong> / <strong>admin123</strong>
            </Typography>
            <Typography variant="body2" align="center">
              👤 User: <strong>user</strong> / <strong>user123</strong>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;