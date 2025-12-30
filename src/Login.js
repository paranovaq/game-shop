import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from './store/hooks';
import { loginUser, clearError } from './store/slices/authSlice';
import ThemeToggle from "./components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [touched, setTouched] = useState({ username: false, password: false });

  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 32) return "Username must be at most 32 characters";
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, _ and .";
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 32) return "Password must be at most 32 characters";
    const passwordRegex = /^[a-zA-Z0-9_.]+$/;
    if (!passwordRegex.test(password)) return "Password can only contain letters, numbers, _ and .";
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) return "Password must contain at least one uppercase letter";
    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) return "Password must contain at least one number";
    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
    
    if (error) dispatch(clearError());
    
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
    
    if (name === 'username') {
      setErrors(prev => ({ ...prev, username: validateUsername(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
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
    
    if (usernameError || passwordError) {
      return;
    }
    
    const result = await dispatch(loginUser({
      username: credentials.username,
      password: credentials.password
    }));
    
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const handleTestAccount = (username, password) => {
    setCredentials({ username, password });
    setTouched({ username: true, password: true });
    setErrors({ username: "", password: "" });
    if (error) dispatch(clearError());
  };

  const theme = useAppSelector((state) => state.ui.darkMode);
  const gradient = theme 
    ? "linear-gradient(135deg, #2c3e50 0%, #4a148c 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const inputBackground = theme 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.35)';

  const inputTextColor = theme ? 'white' : 'inherit';
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
        <ThemeToggle />
        
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: gradient,
            color: "white",
            width: "100%",
            boxShadow: theme 
              ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(4px)',
            border: theme 
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
              textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
              mb: 1
            }}
          >
            🎮 Game Store Login
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                color: errorColor,
                border: `1px solid ${errorColor}`
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
              onBlur={handleBlur}
              variant="filled"
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
              disabled={loading}
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground, 
                  borderRadius: 1,
                  color: inputTextColor,
                  '&:hover': {
                    backgroundColor: theme 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.35)',
                  },
                  '&.Mui-error': {
                    backgroundColor: theme 
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
              disabled={loading}
              InputProps={{
                sx: { 
                  backgroundColor: inputBackground, 
                  borderRadius: 1,
                  color: inputTextColor,
                  '&:hover': {
                    backgroundColor: theme 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.35)',
                  },
                  '&.Mui-error': {
                    backgroundColor: theme 
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
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                Test Accounts:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTestAccount('admin', 'Admin123')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.75rem',
                    py: 0.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Admin (admin/Admin123)
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTestAccount('user', 'User123')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.75rem',
                    py: 0.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  User (user/User123)
                </Button>
              </Box>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!!errors.username || !!errors.password || loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: errors.username || errors.password || loading
                  ? 'linear-gradient(45deg, #95a5a6, #7f8c8d)' 
                  : 'linear-gradient(45deg, #00b894, #00a085)',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: errors.username || errors.password || loading
                  ? '0 4px 15px rgba(149, 165, 166, 0.3)' 
                  : '0 4px 15px rgba(0, 184, 148, 0.3)',
                '&:hover': {
                  background: errors.username || errors.password || loading
                    ? 'linear-gradient(45deg, #7f8c8d, #6c7b7b)' 
                    : 'linear-gradient(45deg, #00a085, #008b74)',
                  boxShadow: errors.username || errors.password || loading
                    ? '0 6px 20px rgba(149, 165, 166, 0.4)' 
                    : '0 6px 20px rgba(0, 184, 148, 0.4)',
                  transform: errors.username || errors.password || loading ? 'none' : 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              {loading ? (
                <>
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      color: 'white',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-12px'
                    }} 
                  />
                  <span style={{ opacity: 0 }}>Sign In</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <strong>Password requirements:</strong>
              <br />
              • 6-32 characters
              <br />
              • At least one uppercase letter
              <br />
              • At least one number
              <br />
              • Only letters, numbers, _ and .
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;