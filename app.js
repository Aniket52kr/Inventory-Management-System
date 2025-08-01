require('dotenv').config();
const express = require('express');
const app = express();

// Database connection
const db = require('./config/db');

// Middleware
app.use(express.json());


// Route files
const productRoutes = require('./routes/productRoutes');
const alertRoutes = require('./routes/alertRoutes');
const companyRoutes = require('./routes/companyRoutes'); 
const warehouseRoutes = require('./routes/warehouseRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productSupplierRoutes = require('./routes/productSupplierRoutes');
const salesRoutes = require('./routes/salesRoutes');


// Health check route
app.get('/', (req, res) => {
  res.send('Bynry Inventory Backend API is running');
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/companies', companyRoutes); 
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/product-suppliers', productSupplierRoutes);
app.use('/api/sales', salesRoutes);


// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
