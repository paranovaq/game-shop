import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
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
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [touched, setTouched] = useState({ username: false, password: false });
  const theme = useTheme();

  const users = [
    { username: "admin", password: "Admin123", role: "admin" },
    { username: "user", password: "User123", role: "user" }
  ];

  // Функция валидации имени пользователя
  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username is required";
    }
    
    if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    
    if (username.length > 32) {
      return "Username must be at most 32 characters";
    }
    
    // Только латинские буквы, цифры, _ и .
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return "Username can only contain letters, numbers, _ and .";
    }
    
    return "";
  };

  // Функция валидации пароля
  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required";
    }
    
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    
    if (password.length > 32) {
      return "Password must be at most 32 characters";
    }
    
    // Только латинские буквы, цифры, _ и .
    const passwordRegex = /^[a-zA-Z0-9_.]+$/;
    if (!passwordRegex.test(password)) {
      return "Password can only contain letters, numbers, _ and .";
    }
    
    // Хотя бы одна заглавная буква
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter";
    }
    
    // Хотя бы одна цифра
    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    
    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
    
    // Валидация при изменении
    if (touched[name]) {
      if (name === 'username') {
        setErrors(prev => ({ ...prev, username: validateUsername(value) }));
      } else if (name === 'password') {
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Валидация при потере фокуса
    if (name === 'username') {
      setErrors(prev => ({ ...prev, username: validateUsername(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Валидация всех полей перед отправкой
    const usernameError = validateUsername(credentials.username);
    const passwordError = validatePassword(credentials.password);
    
    setErrors({
      username: usernameError,
      password: passwordError
    });
    
    setTouched({
      username: true,
      password: true
    });
    
    // Если есть ошибки, не отправляем форму
    if (usernameError || passwordError) {
      return;
    }
    
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      onLogin(user);
    } else {
      setErrors(prev => ({ 
        ...prev, 
        password: "Invalid username or password" 
      }));
    }
  };

  const gradient = theme.palette.mode === 'dark' 
    ? "linear-gradient(135deg, #2c3e50 0%, #4a148c 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const inputBackground = theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.35)';

  const inputTextColor = theme.palette.mode === 'dark' ? 'white' : 'inherit';
  const errorColor = '#ff6b6b';

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
              textShadow: '2px 2px 4px rgba(0,0,0,0.15)'
            }}
          >
            🎮 Game Store Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              onBlur={handleBlur}
              variant="filled"
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground, 
                  borderRadius: 1,
                  color: inputTextColor,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.35)',
                  },
                  '&.Mui-error': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 107, 107, 0.1)' 
                      : 'rgba(255, 107, 107, 0.05)',
                  }
                },
              }}
              InputLabelProps={{
                sx: { 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-error': {
                    color: errorColor,
                  }
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: errorColor,
                  fontSize: '0.8rem',
                  marginLeft: 0,
                }
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
              onBlur={handleBlur}
              variant="filled"
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground, 
                  borderRadius: 1,
                  color: inputTextColor,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.35)',
                  },
                  '&.Mui-error': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 107, 107, 0.1)' 
                      : 'rgba(255, 107, 107, 0.05)',
                  }
                },
              }}
              InputLabelProps={{
                sx: { 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-error': {
                    color: errorColor,
                  }
                },
              }}
              FormHelperTextProps={{
                sx: {
                  color: errorColor,
                  fontSize: '0.8rem',
                  marginLeft: 0,
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!!errors.username || !!errors.password}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: errors.username || errors.password 
                  ? 'linear-gradient(45deg, #95a5a6, #7f8c8d)' 
                  : 'linear-gradient(45deg, #00b894, #00a085)',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: errors.username || errors.password 
                  ? '0 4px 15px rgba(149, 165, 166, 0.3)' 
                  : '0 4px 15px rgba(0, 184, 148, 0.3)',
                '&:hover': {
                  background: errors.username || errors.password 
                    ? 'linear-gradient(45deg, #7f8c8d, #6c7b7b)' 
                    : 'linear-gradient(45deg, #00a085, #008b74)',
                  boxShadow: errors.username || errors.password 
                    ? '0 6px 20px rgba(149, 165, 166, 0.4)' 
                    : '0 6px 20px rgba(0, 184, 148, 0.4)',
                  transform: errors.username || errors.password ? 'none' : 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;