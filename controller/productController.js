const Product = require('../models/Product');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: 'success', data: products, message: 'fetch successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Product By Id
exports.getByProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product, message: 'fetch successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ status: 'success', data: product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Product by ID
exports.updateProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete Product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', message: 'delete successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Order Product by ID
exports.orderProductById = async (req, res) => {
  try {
    const { onlineOrder, orderedQuantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          onlineOrder: onlineOrder,
          orderedQuantity: orderedQuantity,
        },
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product, message: 'order update successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Receive Product by ID
exports.receiveProductById = async (req, res) => {
  try {
    const { orderedQuantity, inStore } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          orderedQuantity: -orderedQuantity,
          inStore: inStore,
        },
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product, message: 'receive update successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Cancel Order by ID
exports.cancelOrderById = async (req, res) => {
  try {
    const { orderedQuantity, onlineOrder } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          orderedQuantity: -orderedQuantity,
          onlineOrder: onlineOrder,
        },
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product, message: 'cancel update successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
