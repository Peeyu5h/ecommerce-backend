# Ecommerce Backend

A RESTful backend API for a modern ecommerce application built with **Node.js**, **Express.js**, and **MongoDB**.

## 🚀 Live API

https://shopers.up.railway.app/

Example:

```
GET /api/products
```

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Railway Deployment

---

## ✨ Features

### Authentication

- User Registration
- User Login
- Password Hashing (bcrypt)
- JWT Authentication
- Protected Routes

### Products

- Get All Products
- Get Product By Id
- Create Product (Admin)
- Search Products
- Category Filtering
- Stock Filtering
- Sorting
- Pagination

### Categories

- Get Categories
- Create Category
- Category Details

### Cart

- Add Product to Cart
- Update Quantity
- Remove Product
- Clear Cart
- Get Cart
- Move Wishlist Items to Cart

### Wishlist

- Add to Wishlist
- Remove from Wishlist
- Get Wishlist
- Clear Wishlist

---

## 📁 Project Structure

```
src
│
├── config
│   └── db.js
│
├── controllers
│
├── middleware
│
├── models
│
├── routes
│
├── utils
│
├── app.js
└── server.js
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Peeyu5h/ecommerce-backend.git
```

Go into project

```bash
cd ecommerce-backend
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Run production server

```bash
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file.

```
PORT=5000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

### Products

| Method | Endpoint |
|---------|----------|
| GET | /api/products |
| GET | /api/products/:id |
| POST | /api/products |

---

### Categories

| Method | Endpoint |
|---------|----------|
| GET | /api/categories |
| GET | /api/categories/:id |
| POST | /api/categories |

---

### Cart

| Method | Endpoint |
|---------|----------|
| GET | /api/cart |
| POST | /api/cart |
| PATCH | /api/cart |
| DELETE | /api/cart/:cartItemId |
| DELETE | /api/cart |

---

### Wishlist

| Method | Endpoint |
|---------|----------|
| GET | /api/wishlist |
| POST | /api/wishlist |
| DELETE | /api/wishlist/:productId |
| DELETE | /api/wishlist |
| POST | /api/wishlist/move-to-cart |

---

## 🔐 Authentication

Protected APIs require a JWT token.

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🚀 Deployment

Backend deployed using **Railway**.

MongoDB hosted on **MongoDB Atlas**.

---

## 👨‍💻 Author

**Piyush Pandole**

GitHub

https://github.com/Peeyu5h
