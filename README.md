# 🏗️ Bynry Inventory Backend API

A B2B inventory management backend system for **StockFlow**, built using **Node.js, Express.js, and MySQL**. This project was developed as part of the **Backend Engineering Intern Case Study** for Bynry Inc.

---

## 🚀 Features Implemented

| Feature                      | Description |
|------------------------------|-------------|
| Create companies             | Manage tenants (B2B) |
| Add warehouses               | Track locations per company |
| Add products with inventory  | Products tracked by SKU and quantity |
| Link suppliers to products   | Enables reordering in low-stock alerts |
| Track inventory logs         | Tracks stock-in/out history |
| Simulate sales               | Reduces stock and logs sales |
| Low-stock alerts             | Based on threshold and sales activity |
| Clean database schema        | Normalized, scalable structure |

---

## 🧠 Thought Process & Approach

### 🔍 Part 1: Debugging & Refactoring
Original Python/Flask product endpoint had multiple critical issues:
- **No SKU uniqueness validation**
- **No input validation**
- **No transaction wrapping**
- **No inventory logging**
- **No error handling**

Rebuilt the logic in `Express.js` with:
- Validation
- Transactions
- Unique SKU enforcement
- Inventory logging
- Safe fallback and rollback

---

### 🧩 Part 2: Database Design

####  Entity Highlights:
- `companies` → manages multiple `warehouses`
- `products` have unique SKUs across platform
- `inventory` per product per warehouse
- `inventory_logs` for stock movement tracking
- `suppliers` linked via `product_suppliers`
- `sales` for tracking historical activity
- `product_bundles` for bundle support

####  Indexes & Constraints:
- `UNIQUE(product_id, warehouse_id)` in `inventory`
- `sku` uniqueness in `products`
- `FOREIGN KEY ON DELETE CASCADE` for cleanup
- `sales(product_id, sale_date)` indexed for alerts

---

### 📉 Part 3: Low-Stock Alert Endpoint

- Filters only **active products** (with sales in last 30 days)
- Calculates `days_until_stockout` based on daily sales
- Includes `supplier` info for reordering
- Handles multiple warehouses per company

---

## 🗃️ Database Schema

Included in [`schema.sql`](./models/schema.sql)

---

## 📡 API Endpoints

> Base URL: `http://localhost:3000/api`

### 📁 Companies
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/companies`          | Create a new company |

### 🏠 Warehouses
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/warehouses`         | Create a warehouse for a company |

### 📦 Products
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/products`           | Add product + initial inventory |

### 🧍 Suppliers
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/suppliers`          | Add new supplier |

### 🔗 Product-Supplier Mapping
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/product-suppliers`  | Link product to supplier |

### 🧾 Sales (Simulated)
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/sales`              | Simulate a sale and decrease inventory |

### 🚨 Low Stock Alerts
| Method | Endpoint                                           | Description |
|--------|----------------------------------------------------|-------------|
| GET    | `/alerts/companies/:company_id/alerts/low-stock`  | Get low-stock alerts for a company |

---

## 🧪 Testing Guide (Postman)

1. Start server: `node app.js`
2. Use Postman to call each route (refer to API table above)
3. Verify DB inserts and responses
4. Use `/alerts/...` to verify low-stock logic

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MySQL 8+**
- **Postman** for testing

---

## 📌 Assumptions Made

- "Recent sales activity" = sales in the last 30 days
- A product can exist in multiple warehouses
- A product can have one or many suppliers
- Each sale reduces inventory and logs the change

---

## 🛡️ Error Handling

All endpoints:
- Validate inputs
- Return proper HTTP status codes (e.g., 400, 409, 500)
- Use transactions where multiple DB writes occur

---

##  How I Solved the Original Code Issues

| Issue in Given Flask Code           | My Solution (Express.js) |
|-------------------------------------|---------------------------|
| No SKU uniqueness                   | Added DB + pre-check      |
| No transactions                     | Wrapped in `beginTransaction()` |
| No inventory logging                | Added `inventory_logs`    |
| No input validation                 | Strong validation & error responses |
| No error handling                   | `try-catch` and rollback |

---

## 🧩 Final Notes

This system is designed with:
- Clean modular routes and controllers
- Flexible schema for growth (suppliers, bundles, etc.)
- Production-level error safety and code practices


