import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { supabase } from '../../utils/supabaseClient';

function RiderOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            customer:customer_id(name)
          `)
          .or(`rider_id.eq.${user.id},and(rider_id.is.null,status.eq.pending)`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptOrder(orderId) {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('orders')
          .update({
            rider_id: user.id,
            status: 'in_progress',
          })
          .eq('id', orderId);

        if (error) throw error;
        getOrders(); // Refresh orders list
      }
    } catch (error) {
      console.error('Error accepting order:', error.message);
      alert('Error accepting order');
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteOrder(orderId) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
        })
        .eq('id', orderId);

      if (error) throw error;
      getOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error completing order:', error.message);
      alert('Error completing order');
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Pickup</TableCell>
              <TableCell>Dropoff</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Loading...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No orders found</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer?.name || 'Unknown'}</TableCell>
                  <TableCell>{order.pickup_location}</TableCell>
                  <TableCell>{order.dropoff_location}</TableCell>
                  <TableCell>KES {order.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.status === 'pending' && !order.rider_id && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleAcceptOrder(order.id)}
                        disabled={loading}
                      >
                        Accept
                      </Button>
                    )}
                    {order.status === 'in_progress' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleCompleteOrder(order.id)}
                        disabled={loading}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RiderOrders; 