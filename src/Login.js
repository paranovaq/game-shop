import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from './store/hooks';
import { loginUser } from './store/slices/authSlice';
import ThemeToggle from "./components/ThemeToggle"; 

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    
    if (!credentials.username || !credentials.password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    
    try {
      const result = await dispatch(loginUser({
        username: credentials.username,
        password: credentials.password
      })).unwrap();
      
      if (result) {
        navigate('/');
      }
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccount = (username, password) => {
    setCredentials({ username, password });
    setError("");
  };

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
        
        <Box sx={{ position: 'absolute', top: -60, left: 550 }}>
          <ThemeToggle />
        </Box>

        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            textAlign: 'center',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 3
            }}
          >
            🎮 Game Store Login
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              disabled={loading}
            />
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                Test Accounts:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTestAccount('admin', 'Admin123')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Admin
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleTestAccount('user', 'User123')}
                  sx={{ fontSize: '0.75rem' }}
                >
                  User
                </Button>
              </Box>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontWeight: "bold",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;