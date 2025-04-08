import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, AddShoppingCart, Remove } from '@mui/icons-material';
import { supabase } from '../../utils/supabaseClient';

function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    fetchProducts();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mb: 2, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <Chip
          label="All"
          onClick={() => handleCategorySelect(null)}
          color={selectedCategory === null ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onClick={() => handleCategorySelect(category.id)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image_url || 'https://via.placeholder.com/140'}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {
                    // Add to cart functionality will be implemented later
                    console.log('Add to cart:', product);
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CustomerHome; 