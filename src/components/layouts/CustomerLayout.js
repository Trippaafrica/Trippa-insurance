import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  Person as ProfileIcon,
  Receipt as OrdersIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

function CustomerLayout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [value, setValue] = React.useState(0);

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/customer');
        break;
      case 1:
        navigate('/customer/orders');
        break;
      case 2:
        navigate('/customer/cart');
        break;
      case 3:
        navigate('/customer/profile');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trippa
          </Typography>
          <IconButton color="inherit" onClick={signOut}>
            <ProfileIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Outlet />
      </Box>

      <BottomNavigation
        value={value}
        onChange={handleNavigation}
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Orders" icon={<OrdersIcon />} />
        <BottomNavigationAction
          label="Cart"
          icon={
            <Badge badgeContent={4} color="error">
              <CartIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
      </BottomNavigation>
    </Box>
  );
}

export default CustomerLayout; 