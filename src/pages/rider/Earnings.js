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
} from '@mui/material';
import { supabase } from '../../utils/supabaseClient';

function RiderEarnings() {
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEarnings();
    getRecentOrders();
  }, []);

  async function getEarnings() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get completed orders
        const { data, error } = await supabase
          .from('orders')
          .select('amount, created_at')
          .eq('rider_id', user.id)
          .eq('status', 'completed');

        if (error) throw error;

        if (data) {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

          const earnings = {
            today: 0,
            week: 0,
            month: 0,
            total: 0,
          };

          data.forEach(order => {
            const orderDate = new Date(order.created_at);
            const amount = parseFloat(order.amount);

            earnings.total += amount;

            if (orderDate >= today) {
              earnings.today += amount;
            }
            if (orderDate >= weekAgo) {
              earnings.week += amount;
            }
            if (orderDate >= monthAgo) {
              earnings.month += amount;
            }
          });

          setEarnings(earnings);
        }
      }
    } catch (error) {
      console.error('Error loading earnings:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getRecentOrders() {
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
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        if (data) setRecentOrders(data);
      }
    } catch (error) {
      console.error('Error loading recent orders:', error.message);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Earnings
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Earnings
              </Typography>
              <Typography variant="h5">
                KES {earnings.today.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Week
              </Typography>
              <Typography variant="h5">
                KES {earnings.week.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Month
              </Typography>
              <Typography variant="h5">
                KES {earnings.month.toFixed(2)}
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
                KES {earnings.total.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Recent Orders
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
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No completed orders found</TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer?.name || 'Unknown'}</TableCell>
                  <TableCell>{order.pickup_location}</TableCell>
                  <TableCell>{order.dropoff_location}</TableCell>
                  <TableCell>KES {order.amount}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
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

export default RiderEarnings; 