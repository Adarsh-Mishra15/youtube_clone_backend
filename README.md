# 🎥 YouTube Backend Clone

A fully functional backend system replicating core features of YouTube — built using **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**.  
This project focuses on creating a scalable, secure, and modular RESTful API that supports user authentication, video management, likes, comments, subscriptions, and playlists.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure user registration and login using **JWT (JSON Web Token)**.
- **Role-based access control (RBAC)** for Admin, Creator, and Viewer roles.
- Password encryption using **bcrypt**.

### 🎬 Video Management
- Upload, update, and delete video entries (with metadata and privacy control).
- Handle video details such as title, description, views, and likes count.
- Pagination and search support for large datasets.

### ❤️ Engagement System
- Like and dislike videos.
- Add, edit, and delete comments.
- Subscribe and unsubscribe from channels.

### 🎵 Playlists
- Create and manage user playlists.
- Add or remove videos from playlists.
- Retrieve personalized playlist data.

### 🧩 Additional Functionalities
- RESTful APIs with proper status codes and validation.
- Centralized error handling and logging middleware.
- Optimized **Mongoose aggregation pipelines** for faster query performance.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT, bcrypt |
| **API Testing** | Postman, JMeter |
| **Utilities** | dotenv, nodemon, multer |

---

## ⚙️ Getting Started

Follow the steps below to run the project locally.

### 🔧 Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or later)
- **MongoDB** (running locally or via MongoDB Atlas)
- **Git**

### 🧩 Clone the Repository
```bash
git clone https://github.com/Adarsh-Mishra15/youtube_clone_backend.git
cd youtube_clone_backend
