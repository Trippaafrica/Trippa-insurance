import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

function Cart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    pickup_location: '',
    dropoff_location: '',
    item_description: '',
    estimated_weight: '',
  });

  const handleChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value,
    });
  };

  const calculateEstimatedCost = () => {
    // Simple calculation based on distance (you can make this more complex)
    const basePrice = 500; // Base price in KES
    const weightFactor = parseFloat(orderDetails.estimated_weight) || 1;
    return basePrice * weightFactor;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderDetails.pickup_location || !orderDetails.dropoff_location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/customer/login');
        return;
      }

      const newOrder = {
        customer_id: user.id,
        pickup_location: orderDetails.pickup_location,
        dropoff_location: orderDetails.dropoff_location,
        item_description: orderDetails.item_description,
        estimated_weight: parseFloat(orderDetails.estimated_weight) || 1,
        amount: calculateEstimatedCost(),
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert([newOrder]);

      if (orderError) throw orderError;

      // Redirect to orders page with success message
      navigate('/customer/orders', {
        state: { message: 'Order placed successfully!' },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Place Order
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 3 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Pickup Location"
                name="pickup_location"
                value={orderDetails.pickup_location}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Dropoff Location"
                name="dropoff_location"
                value={orderDetails.dropoff_location}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Item Description"
                name="item_description"
                value={orderDetails.item_description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Estimated Weight (kg)"
                name="estimated_weight"
                type="number"
                value={orderDetails.estimated_weight}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: "0.1", step: "0.1" }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Base Price
                </Typography>
                <Typography variant="h6">
                  KES 500
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Total
                </Typography>
                <Typography variant="h5">
                  KES {calculateEstimatedCost()}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cart; 