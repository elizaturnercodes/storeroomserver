const sqlite3 = require('sqlite3').verbose();

exports.getAllProducts = async (req, res) => {
  try {
    const db = req.db;

    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }

      res.status(200).json({ status: 'success', data: rows, message: 'fetch successful' });
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getByProductsById = async (req, res) => {
  try {
    const db = req.db;
    const productId = req.params.id;

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }

      if (!row) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      res.status(200).json({ status: 'success', data: row, message: 'fetch successful' });
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const db = req.db;
    const { productName, productPrice, productSKU, inStore, onlineOrder, imageUrl } = req.body;

    db.run(
      'INSERT INTO products (productName, productPrice, productSKU, inStore, onlineOrder, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [productName, productPrice, productSKU, inStore, onlineOrder, imageUrl],
      function (err) {
        if (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }

        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
          }

          res.status(201).json({ status: 'success', data: row, message: 'Product created successfully' });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Product by ID
exports.updateProductById = async (req, res) => {
  try {
    const db = req.db;
    const productId = req.params.id;
    const { productName, productPrice, productSKU, inStore, onlineOrder, imageUrl } = req.body;

    db.run(
      'UPDATE products SET productName = ?, productPrice = ?, productSKU = ?, inStore = ?, onlineOrder = ?, imageUrl = ? WHERE id = ?',
      [productName, productPrice, productSKU, inStore, onlineOrder, imageUrl, productId],
      function (err) {
        if (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }

        if (this.changes === 0) {
          return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
          if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
          }

          res.status(200).json({ status: 'success', data: row, message: 'Product updated successfully' });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const db = req.db;
    const productId = req.params.id;

    db.run('DELETE FROM products WHERE id = ?', [productId], function (err) {
      if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      res.status(200).json({ status: 'success', message: 'delete successful' });
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.orderProductById = async (req, res) => {
  try {
    const db = req.db;
    const productId = req.params.id;
    const { onlineOrder, orderedQuantity } = req.body;

    db.run(
      'UPDATE products SET onlineOrder = onlineOrder + ?, orderedQuantity = orderedQuantity + ? WHERE id = ?',
      [onlineOrder, orderedQuantity, productId],
      function (err) {
        if (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }

        if (this.changes === 0) {
          return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
          if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
          }

          res.status(200).json({ status: 'success', data: row, message: 'order update successful' });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.receiveProductById = async (req, res) => {
  try {
    const db = req.db;
    const productId = req.params.id;
    const { orderedQuantity, inStore } = req.body;

    db.run('UPDATE products SET orderedQuantity = orderedQuantity - ?, inStore = inStore + ? WHERE id = ?', [orderedQuantity, inStore, productId], function (err) {
      if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }

        res.status(200).json({ status: 'success', data: row, message: 'receive update successful' });
      });
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.cancelOrderById = async (req, res) => {
  try {
    const db = req.db;
    const productId = req.params.id;
    const { orderedQuantity, onlineOrder } = req.body;

    db.run(
      'UPDATE products SET orderedQuantity = orderedQuantity - ?, onlineOrder = onlineOrder + ? WHERE id = ?',
      [orderedQuantity, onlineOrder, productId],
      function (err) {
        if (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }

        if (this.changes === 0) {
          return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
          if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
          }

          res.status(200).json({ status: 'success', data: row, message: 'cancel update successful' });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
