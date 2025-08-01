const pool = require('../config/db');

exports.recordSale = async (req, res) => {
  const { product_id, warehouse_id, quantity } = req.body;

  if (!product_id || !warehouse_id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'product_id, warehouse_id, and positive quantity are required' });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Insert into sales table
    await connection.query(
      'INSERT INTO sales (product_id, warehouse_id, quantity) VALUES (?, ?, ?)',
      [product_id, warehouse_id, quantity]
    );

    // 2. Log into inventory_logs
    await connection.query(
      'INSERT INTO inventory_logs (product_id, warehouse_id, quantity_change, reason) VALUES (?, ?, ?, ?)',
      [product_id, warehouse_id, -quantity, 'sale']
    );

    // 3. Update inventory
    const [updateResult] = await connection.query(
      'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND warehouse_id = ?',
      [quantity, product_id, warehouse_id]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Inventory not found for the given product and warehouse' });
    }

    await connection.commit();

    res.status(201).json({ message: '✅ Sale recorded successfully' });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('❌ Error recording sale:', err.message);
    res.status(500).json({ error: 'Internal server error while recording sale' });
  } finally {
    if (connection) connection.release();
  }
};
