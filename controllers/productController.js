const pool = require('../config/db');

exports.createProduct = async (req, res) => {
  let { name, sku, price, warehouse_id, initial_quantity, threshold = 0 } = req.body;

  // Trim and validate required fields
  name = name?.trim();
  sku = sku?.trim();

  if (!name || !sku || price === undefined || warehouse_id === undefined || initial_quantity === undefined) {
    return res.status(400).json({ error: 'All fields are required: name, sku, price, warehouse_id, initial_quantity' });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  if (isNaN(initial_quantity) || initial_quantity < 0) {
    return res.status(400).json({ error: 'Initial quantity must be a non-negative number' });
  }

  if (isNaN(threshold) || threshold < 0) {
    return res.status(400).json({ error: 'Threshold must be a non-negative number' });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Ensure SKU is unique across platform
    const [existing] = await connection.query(
      'SELECT id FROM products WHERE sku = ?',
      [sku]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }

    // Insert product
    const [productResult] = await connection.query(
      'INSERT INTO products (name, sku, price, threshold) VALUES (?, ?, ?, ?)',
      [name, sku, price, threshold]
    );

    const productId = productResult.insertId;

    // Insert inventory
    await connection.query(
      'INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES (?, ?, ?)',
      [productId, warehouse_id, initial_quantity]
    );

    // Log inventory change
    await connection.query(
      'INSERT INTO inventory_logs (product_id, warehouse_id, quantity_change, reason) VALUES (?, ?, ?, ?)',
      [productId, warehouse_id, initial_quantity, 'initial_stock']
    );

    await connection.commit();

    res.status(201).json({ message: '✅ Product created successfully', product_id: productId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Error creating product:', error.message);
    res.status(500).json({ error: 'Internal server error while creating product' });

  } finally {
    if (connection) connection.release();
  }
};
