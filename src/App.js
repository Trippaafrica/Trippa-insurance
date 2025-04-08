import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { supabase } from './utils/supabaseClient';

// Layouts
import CustomerLayout from './components/layouts/CustomerLayout';
import RiderLayout from './components/layouts/RiderLayout';

// Customer Pages
import CustomerHome from './pages/customer/Home';
import CustomerProfile from './pages/customer/Profile';
import CustomerOrders from './pages/customer/Orders';
import CustomerCart from './pages/customer/Cart';
import CustomerLogin from './pages/customer/Login';
import CustomerRegister from './pages/customer/Register';

// Rider Pages
import RiderHome from './pages/rider/Home';
import RiderProfile from './pages/rider/Profile';
import RiderOrders from './pages/rider/Orders';
import RiderEarnings from './pages/rider/Earnings';
import RiderLogin from './pages/rider/Login';
import RiderRegister from './pages/rider/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B00',
      light: '#FF8C42',
      dark: '#CC5500',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
        } else {
          setUser(session?.user ?? null);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
        <Typography color="error" variant="h6" gutterBottom>
          Error: {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Customer Routes */}
        <Route path="/customer" element={user?.user_metadata?.user_type === 'customer' ? <CustomerLayout /> : <Navigate to="/customer/login" />}>
          <Route index element={<CustomerHome />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="cart" element={<CustomerCart />} />
        </Route>
        <Route path="/customer/login" element={!user ? <CustomerLogin /> : <Navigate to="/customer" />} />
        <Route path="/customer/register" element={!user ? <CustomerRegister /> : <Navigate to="/customer" />} />

        {/* Rider Routes */}
        <Route path="/rider" element={user?.user_metadata?.user_type === 'rider' ? <RiderLayout /> : <Navigate to="/rider/login" />}>
          <Route index element={<RiderHome />} />
          <Route path="profile" element={<RiderProfile />} />
          <Route path="orders" element={<RiderOrders />} />
          <Route path="earnings" element={<RiderEarnings />} />
        </Route>
        <Route path="/rider/login" element={!user ? <RiderLogin /> : <Navigate to="/rider" />} />
        <Route path="/rider/register" element={!user ? <RiderRegister /> : <Navigate to="/rider" />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/customer" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 