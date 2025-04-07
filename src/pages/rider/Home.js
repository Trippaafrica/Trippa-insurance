import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { LocalShipping, LocationOn, AccessTime } from '@mui/icons-material';
import { supabase } from '../../utils/supabaseClient';

function RiderHome() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'accepted', rider_id: user.id })
        .eq('id', orderId);

      if (error) throw error;
      fetchAvailableOrders();
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Available Orders
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <List>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem
                  sx={{
                    bgcolor: selectedOrder?.id === order.id ? 'action.hover' : 'background.paper',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShipping fontSize="small" />
                        <Typography variant="subtitle1">
                          Order #{order.id}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={order.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn fontSize="small" />
                          <Typography variant="body2">
                            {order.delivery_address}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <AccessTime fontSize="small" />
                          <Typography variant="body2">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      Accept
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedOrder && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Details
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Customer:</strong> {selectedOrder.customer?.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Phone:</strong> {selectedOrder.customer?.phone}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Delivery Address:</strong> {selectedOrder.delivery_address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Amount:</strong> ${selectedOrder.total_amount}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleAcceptOrder(selectedOrder.id)}
                >
                  Accept Order
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default RiderHome; 