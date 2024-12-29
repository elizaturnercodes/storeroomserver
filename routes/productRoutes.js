const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Get All Products
router.get('/', authenticateToken, authorizeRole(['employee', 'admin']), productController.getAllProducts);

// Create Product
router.post('/', authenticateToken, authorizeRole(['employee', 'admin']), productController.createProduct);

// Update Product
router.patch('/:id', authenticateToken, authorizeRole(['employee', 'admin']), productController.updateProductById);

// Order Product
router.patch('/order/:id', authenticateToken, authorizeRole(['employee', 'admin']), productController.orderProductById);

// Receive Product
router.patch('/receive/:id', authenticateToken, authorizeRole(['employee', 'admin']), productController.receiveProductById);

// Cancel Order
router.patch('/cancel/:id', authenticateToken, authorizeRole(['employee', 'admin']), productController.cancelOrderById);

// Get Product by ID
router.get('/:id', authenticateToken, productController.getByProductsById);

// Delete Product
router.delete('/:id', authenticateToken, authorizeRole(['employee', 'admin']), productController.deleteProductById);

module.exports = router;
