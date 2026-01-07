# 🪑 FurniDecor — Full-Stack MERN Furniture Platform

FurniDecor is a full-stack furniture management platform built using the **MERN stack**.  
It includes a modern **admin dashboard**, a **client-facing frontend**, and a **scalable backend API** designed with real-world deployment practices.

This project demonstrates clean architecture, environment-based configuration, and cloud deployment using industry-standard tools.

---

## ✨ Key Features

- Admin dashboard for managing furniture products
- RESTful backend API built with Express
- MongoDB database integration using Mongoose
- Modern React frontend powered by Vite
- Secure environment variable handling
- Cloud deployment with Render
- Modular and scalable project structure

---

## 🧑‍💻 Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Infrastructure & Deployment
- Render (Backend & Static Sites)
- MongoDB Atlas
- Environment Variables

---

## 📁 Project Structure
```
furniture-mern/
│
├── admin/ # Admin dashboard (React + Vite)
│ ├── src/
│ ├── public/
│ ├── dist/
│ ├── vite.config.js
│ └── package.json
│
├── client/ # Client-facing frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/ # Backend API
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── index.js
│
├── .gitignore
└── README.md
```


##  setup Environment variables in `.env` 
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🛠️ Local Development Setup

### 1️. Clone the repository
```bash
git clone https://github.com/vivek-boini/furniture.git
cd furniture
```

### 2. Backend Setup
```
cd server
npm install
npm start
```

### 3. Admin Dashboard
```
cd admin
npm install
npm run dev
```

### 4. Client Frontend
```
cd client
npm install
npm run dev
```

## 👤 Author

Vivek Boini
GitHub: https://github.com/vivek-boini

