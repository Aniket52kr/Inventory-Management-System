const pool = require('../config/db');

exports.getLowStockAlerts = async (req, res) => {
  const { company_id } = req.params;

  try {
    const [alerts] = await pool.query(
      `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        w.id AS warehouse_id,
        w.name AS warehouse_name,
        i.quantity AS current_stock,
        p.threshold,
        MAX(s.id) AS supplier_id,
        MAX(s.name) AS supplier_name,
        MAX(s.contact_email) AS contact_email,
        (
          SELECT 
            ROUND(ABS(SUM(il.quantity_change)) / 30, 2)
          FROM inventory_logs il
          WHERE 
            il.product_id = p.id AND
            il.warehouse_id = w.id AND
            il.quantity_change < 0 AND
            il.changed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) AS daily_sales
      FROM 
        products p
      JOIN inventory i ON i.product_id = p.id
      JOIN warehouses w ON w.id = i.warehouse_id
      LEFT JOIN product_suppliers ps ON ps.product_id = p.id
      LEFT JOIN suppliers s ON s.id = ps.supplier_id
      WHERE 
        w.company_id = ? AND
        i.quantity < p.threshold
      GROUP BY p.id, w.id
      `,
      [company_id]
    );

    // Filter out products with no recent sales
    const filteredAlerts = alerts
      .filter(row => row.daily_sales && row.daily_sales > 0)
      .map(row => {
        const daysUntilStockout = Math.floor(row.current_stock / row.daily_sales);

        return {
          product_id: row.product_id,
          product_name: row.product_name,
          sku: row.sku,
          warehouse_id: row.warehouse_id,
          warehouse_name: row.warehouse_name,
          current_stock: row.current_stock,
          threshold: row.threshold,
          days_until_stockout: daysUntilStockout,
          supplier: row.supplier_id
            ? {
                id: row.supplier_id,
                name: row.supplier_name,
                contact_email: row.contact_email
              }
            : null
        };
      });

    res.status(200).json({
      alerts: filteredAlerts,
      total_alerts: filteredAlerts.length
    });

  } catch (error) {
    console.error('❌ Error fetching low stock alerts:', error.message);
    res.status(500).json({ error: 'Internal server error while fetching low stock alerts' });
  }
};
