const pool = require('../config/db');

exports.linkProductToSupplier = async (req, res) => {
  const { product_id, supplier_id } = req.body;

  if (!product_id || !supplier_id) {
    return res.status(400).json({ error: 'product_id and supplier_id are required' });
  }

  try {
    // Check if already linked
    const [existing] = await pool.query(
      'SELECT id FROM product_suppliers WHERE product_id = ? AND supplier_id = ?',
      [product_id, supplier_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'This product is already linked to this supplier' });
    }

    // Insert the link
    const [result] = await pool.query(
      'INSERT INTO product_suppliers (product_id, supplier_id) VALUES (?, ?)',
      [product_id, supplier_id]
    );

    res.status(201).json({
      message: '✅ Product linked to supplier successfully',
      link_id: result.insertId
    });

  } catch (err) {
    console.error('❌ Error linking product to supplier:', err.message);
    res.status(500).json({ error: 'Internal server error while linking product to supplier' });
  }
};
