import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
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
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#F5F5F5',
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      <Router>
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
      </Router>
    </ThemeProvider>
  );
}

export default App; 