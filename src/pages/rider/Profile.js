import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar } from '@mui/material';
import { supabase } from '../../utils/supabaseClient';

function RiderProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle_type: '',
    vehicle_model: '',
    plate_number: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile({
            name: data.name || '',
            email: user.email || '',
            phone: data.phone || '',
            vehicle_type: data.vehicle_type || '',
            vehicle_model: data.vehicle_model || '',
            plate_number: data.plate_number || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const updates = {
          id: user.id,
          name: profile.name,
          phone: profile.phone,
          vehicle_type: profile.vehicle_type,
          vehicle_model: profile.vehicle_model,
          plate_number: profile.plate_number,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('profiles')
          .upsert(updates);

        if (error) throw error;
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Error updating profile!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Avatar
            sx={{ width: 100, height: 100, alignSelf: 'center', mb: 2 }}
          />
          <TextField
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={profile.email}
            disabled
            fullWidth
          />
          <TextField
            label="Phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Vehicle Type"
            value={profile.vehicle_type}
            onChange={(e) => setProfile({ ...profile, vehicle_type: e.target.value })}
            fullWidth
          />
          <TextField
            label="Vehicle Model"
            value={profile.vehicle_model}
            onChange={(e) => setProfile({ ...profile, vehicle_model: e.target.value })}
            fullWidth
          />
          <TextField
            label="Plate Number"
            value={profile.plate_number}
            onChange={(e) => setProfile({ ...profile, plate_number: e.target.value })}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={updateProfile}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default RiderProfile; 