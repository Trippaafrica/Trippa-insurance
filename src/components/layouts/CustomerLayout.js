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
  Avatar,
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
  const { signOut, user } = useAuth();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static" 
        color="primary"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            Trippa
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={signOut}
            sx={{ p: 0 }}
          >
            <Avatar 
              src={user?.user_metadata?.avatar_url}
              sx={{ width: 32, height: 32 }}
            >
              {user?.user_metadata?.full_name?.[0] || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 2,
          pb: 8, // Add padding for bottom navigation
        }}
      >
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
          bgcolor: 'background.paper',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeIcon />} 
          sx={{ color: 'text.secondary' }}
        />
        <BottomNavigationAction 
          label="Orders" 
          icon={<OrdersIcon />} 
          sx={{ color: 'text.secondary' }}
        />
        <BottomNavigationAction
          label="Cart"
          icon={
            <Badge badgeContent={4} color="error">
              <CartIcon />
            </Badge>
          }
          sx={{ color: 'text.secondary' }}
        />
        <BottomNavigationAction 
          label="Profile" 
          icon={<ProfileIcon />} 
          sx={{ color: 'text.secondary' }}
        />
      </BottomNavigation>
    </Box>
  );
}

export default CustomerLayout; 