# 🏗️ Bynry Inventory Backend API

A scalable and modular backend system for **StockFlow**, a B2B inventory management platform. Built using **Node.js, Express.js, and MySQL**, this project was developed as part of the **Backend Engineering Intern Case Study** for Bynry Inc.

---

## 🚀 Features Implemented

| Feature                      | Description |
|------------------------------|-------------|
| ✅ Create companies             | Manage B2B clients as separate entities |
| ✅ Add warehouses               | Track multiple locations under each company |
| ✅ Add products with inventory  | Products are tracked via unique SKUs and stored per warehouse |
| ✅ Link suppliers to products   | Maintains supply chain relationships |
| ✅ Track inventory logs         | Logs every inventory movement (add, sale, etc.) |
| ✅ Simulate sales               | Records sale activity and updates inventory |
| ✅ Low-stock alerts             | Alerts based on recent sales and threshold |
| ✅ Clean, normalized schema     | Designed for performance and scalability |

---

## 🧠 Thought Process & Approach

### 🔍 Part 1: Debugging & Refactoring

The original Python/Flask code had several flaws:

- ❌ No SKU uniqueness validation
- ❌ No input validation or field checks
- ❌ No transaction control — caused inconsistent state on failure
- ❌ No inventory logs
- ❌ No error handling (try/catch)

### ✅ My Fixes Using Express.js:

- Enforced SKU uniqueness
- Used transactions (`connection.beginTransaction()`)
- Added inventory logging on creation and sale
- Validated inputs strictly before DB insertion
- Wrapped everything with proper `try/catch` and rollback on error

---

### 🧩 Part 2: Database Design

#### 🧱 Entity Highlights

| Table | Purpose |
|-------|---------|
| `companies` | Stores client companies |
| `warehouses` | Warehouses under each company |
| `products` | Unique SKU, price, threshold |
| `inventory` | Quantity per product per warehouse |
| `inventory_logs` | Logs changes in inventory |
| `suppliers` | Vendor details |
| `product_suppliers` | Many-to-many product-supplier map |
| `product_bundles` | Self-referencing bundles |
| `sales` | Sales tracking (for alert logic) |

#### 🔐 Indexes & Constraints

- `UNIQUE(product_id, warehouse_id)` in `inventory`
- `sku` is unique in `products`
- Foreign keys ensure relational integrity
- Indexed sales table for optimized alert queries

---

### 📉 Part 3: Low-Stock Alert Endpoint

The `GET /alerts/companies/:company_id/alerts/low-stock` endpoint:

- Returns only products with recent sales (last 30 days)
- Filters those **below their threshold**
- Calculates:
  - `daily_sales = total sales / 30`
  - `days_until_stockout = current_stock / daily_sales`
- Includes supplier contact info for fast reordering
- Handles multiple warehouses per company

---


## 📡 API Endpoints

> Base URL: `http://localhost:3000/api`

### 🏢 Companies
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/companies`          | Create a new company |

### 🏠 Warehouses
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/warehouses`         | Add warehouse to a company |

### 📦 Products
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/products`           | Add product and initial stock to warehouse |

### 🧍 Suppliers
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/suppliers`          | Add a new supplier |

### 🔗 Product-Supplier Link
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/product-suppliers`  | Link product to a supplier |

### 🧾 Sales (Simulated)
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/sales`              | Record a product sale and update inventory |

### 🚨 Low Stock Alerts
| Method | Endpoint                                           | Description |
|--------|----------------------------------------------------|-------------|
| GET    | `/alerts/companies/:company_id/alerts/low-stock`  | Get low-stock alerts for a company |

---

## 🧪 Testing Instructions (Postman)

1. Start the server using `node app.js` or `npx nodemon app.js`
2. Use the Postman collection to test endpoints:
   - Create a company
   - Add warehouse
   - Add product and inventory
   - Link supplier
   - Simulate sales
   - Fetch low-stock alerts
3. Observe real-time changes in your MySQL DB

---

## ⚙️ Tech Stack

- **Node.js** 
- **Express.js**
- **MySQL** 
- **Postman**

---

## 📌 Assumptions Made

- Recent activity = sales in last 30 days
- Inventory is tracked per warehouse
- A product can have multiple suppliers, but only one is shown in alerts
- Bundles are supported but not implemented in logic yet

---

## 🛡️ Error Handling & Best Practices

- Input validation for every endpoint
- Consistent use of HTTP status codes (e.g. `400`, `409`, `500`)
- MySQL transactions for multi-step DB operations
- Rollbacks to prevent partial writes
- Try/catch and custom error messages

---

## 🛠️ Fixing Original Issues in the Assignment

| Issue from Flask Code              | My Fix in Express.js |
|-----------------------------------|-----------------------|
| No SKU uniqueness                 | Enforced unique check in DB |
| No rollback if inventory fails    | Wrapped everything in a transaction |
| No logging of inventory movement  | Created `inventory_logs` table |
| No input checks                   | Added validation for all fields |
| No error handling                 | Used `try/catch`, rollback, and clear messages |



