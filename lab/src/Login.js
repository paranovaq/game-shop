import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
} from "@mui/material";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

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

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            🎮 Game Store Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
                sx: { backgroundColor: "white", borderRadius: 1 },
              }}
              InputLabelProps={{
                sx: { color: "white" },
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
                sx: { backgroundColor: "white", borderRadius: 1 },
              }}
              InputLabelProps={{
                sx: { color: "white" },
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
              }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ mt: 2, color: 'white' }}>
            <Typography variant="body2" align="center">
              Demo accounts:
            </Typography>
            <Typography variant="body2" align="center">
              Admin: admin / admin123
            </Typography>
            <Typography variant="body2" align="center">
              User: user / user123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;