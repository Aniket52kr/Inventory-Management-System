const pool = require('../config/db');


exports.createCompany = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO companies (name) VALUES (?)',
      [name.trim()]
    );

    res.status(201).json({
      message: 'Company created successfully',
      company_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating company:', error.message);
    res.status(500).json({ error: 'Internal server error while creating company' });
  }
};
