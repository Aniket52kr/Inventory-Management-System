const pool = require('../config/db');

exports.createWarehouse = async (req, res) => {
    const { company_id, name, location } = req.body;

    if (!company_id || !name) {
        return res.status(400).json({ error: 'company_id and name are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO warehouses (company_id, name, location) VALUES (?, ?, ?)',
            [company_id, name.trim(), location || null]
        );

        res.status(201).json({
            message: '✅ Warehouse created successfully',
            warehouse_id: result.insertId
        });
    } catch (error) {
        console.error('❌ Error creating warehouse:', error.message);
        res.status(500).json({ error: 'Internal server error while creating warehouse' });
    }
};
