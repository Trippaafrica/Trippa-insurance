import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

function RiderRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicle_type: '',
    vehicle_model: '',
    plate_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Register user with Supabase
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            user_type: 'rider',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              name: formData.name,
              phone: formData.phone,
              user_type: 'rider',
              vehicle_type: formData.vehicle_type,
              vehicle_model: formData.vehicle_model,
              plate_number: formData.plate_number,
            },
          ]);

        if (profileError) throw profileError;

        // Redirect to login page with success message
        navigate('/rider/login', {
          state: { message: 'Registration successful! Please check your email to verify your account.' },
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Rider Registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Vehicle Type"
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Vehicle Model"
            name="vehicle_model"
            value={formData.vehicle_model}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Plate Number"
            name="plate_number"
            value={formData.plate_number}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/rider/login">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default RiderRegister; 