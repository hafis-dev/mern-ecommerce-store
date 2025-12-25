# 🛒 ShopX – MERN E‑Commerce Application

A **full-stack MERN e-commerce application** built with modern web technologies, featuring a user-friendly shopping experience and an admin dashboard for product and order management.

---
## 📚 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#%E2%80%8D-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started (Local Setup)](#%EF%B8%8F-getting-started-local-setup)
- [Screenshots](#-screenshots)
- [Demo Video](#-demo-video)
- [License](#-license)
- [Author](#%E2%80%8D-author)
## 🚀 Live Demo

- **Live Application:** https://shopxstore.vercel.app

> Backend API is hosted on Render and connected to MongoDB Atlas.

---

## 📌 Features

### 👤 User Features

* User authentication (JWT + refresh tokens) & **OTP**-based Password Recovery via Twilio
* Browse products with filters & sorting
* Product details with image gallery
* Wishlist & cart management
* Secure checkout process
* Order history & order cancellation
* Profile management

### 🛠️ Admin Features

* Admin-only authentication with protected routes
* Product management (CRUD)
* Category & sub-category handling
* Order management

### ⚙️ General Features

* Responsive UI (mobile & desktop)
* Image upload using Cloudinary
* Optimized API responses
* Protected routes (Admin & User)
* Clean UI with Bootstrap + CSS Modules

---

## 🧑‍💻 Tech Stack

### Frontend

* React (Vite)
* React Router
* Context API
* React Bootstrap
* CSS Modules
* Font Awesome

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (memoryStorage for image uploads)
* Cloudinary (image uploads)
* Twilio (OTP / SMS notifications)


### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📁 Project Structure

```
ecommerce/
├── client/                 # React frontend  
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── index.js
│   └── package.json
│
└── README.md

```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

```

### Frontend (`client/.env`)

```env
VITE_API_BASE_URL=https://mern-ecommerce-store-api.onrender.com/api
```

---

## ▶️ Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/hafis-dev/mern-ecommerce-store.git
cd mern-ecommerce-store.git
```

### 2️⃣ Backend setup

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend setup

```bash
cd client
npm install
npm run dev
```

---
## 📸 Screenshots

### Home Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/e20f465f-67e6-4648-96e7-458205cdf6c1" width="48%" />
</p>

### Products & Product Details
<p align="center">
  <img src="https://github.com/user-attachments/assets/fe74b5c4-93d4-413d-9452-9d478b32d925" width="48%" />
  <img src="https://github.com/user-attachments/assets/17475ba6-3f71-4fb1-8c83-b1af0b94c5ac" width="48%" />
</p>

### Cart & Wishlist
<p align="center">
  <img src="https://github.com/user-attachments/assets/b09c0968-8827-44f6-8ad7-a7b39a5528ce" width="48%" />
  <img src="https://github.com/user-attachments/assets/127e2c37-d7dc-4a8e-ba88-3567263f1589" width="48%" />
</p>

---

## 🎥 Demo Video

[![Watch the demo video](https://img.youtube.com/vi/feB9mRQ-tFQ/0.jpg)](https://youtu.be/feB9mRQ-tFQ)

*Click the image to watch the user-side demo.*

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Muhammed Hafis**  
- GitHub: https://github.com/hafis-dev  
- LinkedIn: https://www.linkedin.com/in/muhammed-hafis-58496029b/

---

⭐ If you like this project, consider giving it a star on GitHub!
