const pool = require('../config/db');

exports.createSupplier = async (req, res) => {
    const { name, contact_email } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Supplier name is required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO suppliers (name, contact_email) VALUES (?, ?)',
            [name.trim(), contact_email || null]
        );

        res.status(201).json({
            message: '✅ Supplier created successfully',
            supplier_id: result.insertId
        });
    } catch (err) {
        console.error('❌ Error creating supplier:', err.message);
        res.status(500).json({ error: 'Internal server error while creating supplier' });
    }
};
