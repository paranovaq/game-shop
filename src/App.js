import './App.css';
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { useAppSelector, useAppDispatch } from './store/hooks';
import { fetchGames } from './store/slices/gamesSlice';
import { setOnlineStatus } from './store/slices/uiSlice';


import Login from "./Login";
import MainPage from "./components/MainPage";
import CartPage from "./components/CartPage";

function App() {
  const dispatch = useAppDispatch();
  
  // Получаем состояние из Redux
  const {loading: gamesLoading } = useAppSelector((state) => state.games);
  const { user } = useAppSelector((state) => state.auth);
  const { darkMode, isLoading: uiLoading } = useAppSelector((state) => state.ui);

  // Создаем тему
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#7bb7e3' : '#1976d2',
        light: darkMode ? '#a8d4f5' : '#42a5f5',
        dark: darkMode ? '#4a8bb9' : '#1565c0',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
        light: darkMode ? '#f8c1d5' : '#ff4081',
        dark: darkMode ? '#bf5f82' : '#9a0036',
      },
      background: {
        default: darkMode ? '#2d3748' : '#f5f6fa',
        paper: darkMode ? '#374151' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f7fafc' : '#1a202c',
        secondary: darkMode ? '#cbd5e0' : '#718096',
      },
      divider: darkMode ? '#4a5568' : '#e2e8f0',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        color: darkMode ? '#f7fafc' : '#1a202c',
      },
      h6: {
        fontWeight: 600,
        color: darkMode ? '#e2e8f0' : '#4a5568',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: darkMode ? '#374151' : '#ffffff',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
          contained: {
            boxShadow: darkMode 
              ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: darkMode ? '#4a5568' : '#e2e8f0',
          },
          head: {
            fontWeight: 700,
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f0f4ff',
            color: darkMode ? '#f7fafc' : '#1a202c',
          },
        },
      },
    },
  });

  // Загружаем игры при монтировании
  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  // Слушатели онлайн статуса
  useEffect(() => {
    const updateOnlineStatus = () => {
      dispatch(setOnlineStatus(navigator.onLine));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [dispatch]);

  const isLoading = gamesLoading || uiLoading;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App" style={{ 
          padding: '20px', 
          backgroundColor: theme.palette.background.default, 
          minHeight: '100vh',
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {isLoading && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}>
                <div style={{ color: 'white', fontSize: '20px' }}>
                  Loading...
                </div>
              </div>
            )}
            
            <Routes>
              <Route path="/login" element={
                user ? <Navigate to="/" /> : 
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
      
                  </div>
                  <Login />
                </div>
              } />
              <Route path="/" element={
                user ? (
                  <MainPage />
                ) : (
                  <Navigate to="/login" />
                )
              } />
              <Route path="/cart" element={
                user ? (
                  <CartPage />
                ) : (
                  <Navigate to="/login" />
                )
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;