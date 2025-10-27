const express = require('express');
const { v4: uuidv4 } = require('uuid');
const products = require('../models/productsData');
const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');

const router = express.Router();

// ✅ GET /api/products (with filtering, pagination, search)
router.get('/', (req, res) => {
  let result = products;

  const { category, search, page = 1, limit = 5 } = req.query;

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  // Pagination
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + parseInt(limit));

  res.json({
    total: result.length,
    page: parseInt(page),
    limit: parseInt(limit),
    products: paginated
  });
});

// ✅ GET /api/products/:id
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    return next(err);
  }
  res.json(product);
});

// ✅ POST /api/products (Requires Auth + Validation)
router.post('/', auth, validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// ✅ PUT /api/products/:id (Requires Auth + Validation)
router.put('/:id', auth, validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    const err = new Error('Product not found');
    err.status = 404;
    return next(err);
  }

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// ✅ DELETE /api/products/:id (Requires Auth)
router.delete('/:id', auth, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    const err = new Error('Product not found');
    err.status = 404;
    return next(err);
  }

  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully' });
});

// ✅ GET /api/products/stats
router.get('/stats/category', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

module.exports = router;
