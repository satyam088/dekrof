# Dekrof

> A full-stack social media platform built with Node.js, Express.js, MongoDB, EJS, and Socket.IO.

---

## Overview

Dekrof is a full-stack social networking application that allows users to connect, share posts, and communicate through real-time messaging. The project follows the MVC architecture and focuses on building a scalable backend with a clean and modular codebase.

---

## Features

### Authentication
- User registration and login
- Session-based authentication
- Secure password hashing
- Protected routes

### User Profiles
- Create and edit profiles
- Upload profile pictures
- Follow and unfollow users

### Posts
- Create image posts
- Like and unlike posts
- Delete own posts
- Infinite scrolling feed

### Messaging
- One-to-one conversations
- Real-time messaging using Socket.IO
- Conversation list
- Latest message preview

### Search
- Search users by username
- View user profiles

### Notifications
- Follow notifications
- Like notifications

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

### Frontend
- EJS
- HTML
- CSS
- Tailwind CSS
- JavaScript

### Cloud Services
- Cloudinary

---

## Project Structure

```text
Dekrof/
│
├── config/
│   ├── cloudinary.js
│   ├── db.js
│   └── multerConfig.js
│
├── controllers/
│ ├── authController.js
│ ├── postController.js
│ ├── messageController.js
│ ├── notificationController.js
│ ├── middleware/
│ ├── auth.js
│ ├── upload.js
|
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SOCKETS.md
│   ├── FEATURES.md
│   ├── INSTALLATION.md
│   ├── DEPLOYMENT.md
|
├── middlewares/
│   ├── authHandler.js
│   ├── deleteFromCloudinary.js
│   ├── isLoggedIn.js
│   ├── notFound.js
│   └── uploadToCloudinary.js
|
├── models/
│ ├── User.js
│ ├── Post.js
│ ├── Conversation.js
│ ├── Message.js
│ ├── Notification.js
|
├── public/
│   ├── assets/
│   │   └── logo.png
│   │
│   ├── images/
│   │   └── uploads/
│   │
│   ├── javascripts/
│   │   ├── chats.js
│   │   ├── editProfile.js
│   │   ├── index.js
│   │   ├── profile.js
│   │   └── searchUserPage.js
│   │
│   └── stylesheets/
│
├── routes/
│   ├── adminRouter.js
│   ├── authRouter.js
│   ├── chatsRouter.js
│   ├── commentRouter.js
│   ├── homeRouter.js
│   ├── imageRouter.js
│   ├── postRouter.js
│   └── userRouter.js
│
├── utils/
│
├── views/
│   ├── partials/
│   │   ├── createPostForm.ejs
│   │   ├── headerlinks.ejs
│   │   ├── loadPosts.ejs
│   │   ├── navbar.ejs
│   │   └── searchbar.ejs
│   │
│   ├── chats.ejs
│   ├── editProfile.ejs
│   ├── followers.ejs
│   ├── following.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── register.ejs
│   ├── searchUserPage.ejs
│   └── test.ejs
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── temp.txt

```
# Getting Started

Follow the steps below to set up and run Dekrof on your local machine.

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm
- MongoDB (Local or MongoDB Atlas)
- Git

---

## Clone the Repository

```bash
git clone https://github.com/satyam088/Dekrof.git
cd Dekrof
```

---

## Install Dependencies

Install all required packages:

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root and add the following variables:

```env
PORT=3000

mongodbURL=<your_mongodb_connection_string>
EXPRESS_SESSION_SECRET=
JWT_KEY=<your_jwt_secret>

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

USER_DEFAULT_PIC = https://res.cloudinary.com/dafdap5cr/image/upload/q_auto/f_auto/v1781797010/defalut_wc1tfy.webp
USER_DEFAULT_PIC_PUBLIC_ID = null
```

> Replace the placeholder values with your own configuration.

---

## Start the Development Server

```bash
npm start
```

If you're using **nodemon**:

```bash
nodemon app
```

---

## Open the Application

After the server starts successfully, open your browser and visit:

```
http://localhost:3000
```

You should now be able to register a new account and start using Dekrof.

---

## 📖 Documentation

Comprehensive documentation for Dekrof is available in the [`docs/`](./docs) directory.

- [Installation Guide](./docs/INSTALLATION.md)
- [Application Architecture](./docs/ARCHITECTURE.md)
- [Database Design](./docs/DATABASE.md)
- [REST API Reference](./docs/API.md)
- [Socket.IO Events](./docs/SOCKETS.md)
- [Features Overview](./docs/FEATURES.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

