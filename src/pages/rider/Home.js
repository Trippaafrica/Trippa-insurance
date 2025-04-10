import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { supabase } from '../../utils/supabaseClient';

function RiderHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    rating: 0,
  });
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats();
    getActiveOrders();
  }, []);

  async function getStats() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get all orders for the rider
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('rider_id', user.id);

        if (error) throw error;

        if (orders) {
          const completedOrders = orders.filter(order => order.status === 'completed');
          const totalEarnings = completedOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0);

          setStats({
            totalOrders: orders.length,
            completedOrders: completedOrders.length,
            totalEarnings,
            rating: 4.5, // This should come from a ratings table in a real app
          });
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getActiveOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            customer:customer_id(name)
          `)
          .eq('rider_id', user.id)
          .eq('status', 'in_progress')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setActiveOrders(data);
      }
    } catch (error) {
      console.error('Error loading active orders:', error.message);
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
      
      // Refresh data
      getStats();
      getActiveOrders();
    } catch (error) {
      console.error('Error completing order:', error.message);
      alert('Error completing order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h5">
                {stats.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Orders
              </Typography>
              <Typography variant="h5">
                {stats.completedOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Earnings
              </Typography>
              <Typography variant="h5">
                KES {stats.totalEarnings.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rating
              </Typography>
              <Typography variant="h5">
                {stats.rating.toFixed(1)} / 5.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Active Orders
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : activeOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No active orders</TableCell>
              </TableRow>
            ) : (
              activeOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer?.name || 'Unknown'}</TableCell>
                  <TableCell>{order.pickup_location}</TableCell>
                  <TableCell>{order.dropoff_location}</TableCell>
                  <TableCell>KES {order.amount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={loading}
                    >
                      Complete
                    </Button>
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

export default RiderHome; 