# Installation Guide

This guide explains how to set up and run Dekrof in a local development environment.

---

# Prerequisites

Before installing the application, ensure the following software is installed on your system.

| Software | Recommended Version |
|----------|---------------------|
| Node.js | 18.x or later |
| npm | Latest |
| MongoDB | Local or MongoDB Atlas |
| Git | Latest |

---

# Clone the Repository

Clone the repository to your local machine.

```bash
git clone https://github.com/satyam088/dekrof.git
```

Navigate into the project directory.

```bash
cd dekrof
```

---

# Install Dependencies

Install all required Node.js packages.

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example configuration:

```env
PORT=3000

mongodbURL=

JWT_KEY=
EXPRESS_SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

USER_DEFAULT_PIC = https://res.cloudinary.com/dafdap5cr/image/upload/q_auto/f_auto/v1781797010/defalut_wc1tfy.webp
USER_DEFAULT_PIC_PUBLIC_ID = null

```

## Environment Variables Description

| Variable | Description |
|----------|-------------|
| PORT | Application port |
| MmongodbURL | MongoDB connection string |
| JWT_KEY | Secret used to sign JWT tokens |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |

---

# Database Configuration

Dekrof supports both:

- Local MongoDB
- MongoDB Atlas

Example MongoDB connection string:

```text
mongodb://localhost:27017/dekrof
```

or

```text
mongodb+srv://<username>:<password>@cluster.mongodb.net/dekrof
```

---

# Cloudinary Configuration

Create a Cloudinary account and obtain the following credentials:

- Cloud Name
- API Key
- API Secret

These values should be added to the `.env` file.

---

# Running the Application

Start the development server.

```bash
npm start
```

If using Nodemon:

```bash
nodemon app
```

---

# Accessing the Application

After the server starts successfully, open your browser and navigate to:

```
http://localhost:3000
```

---

# Project Structure

```
Dekrof/
├── public/
├── routes/
├── utils/
├── views/
├── app.js
├── package.json
└── .env
```

---

# Common Issues

## MongoDB Connection Failed

Possible causes:

- MongoDB service is not running.
- Incorrect connection string.
- Incorrect database credentials.
- IP address is not whitelisted (MongoDB Atlas).

---

## Cloudinary Upload Errors

Possible causes:

- Missing Cloudinary credentials.
- Invalid API key.
- Invalid API secret.

---

## JWT Authentication Errors

Possible causes:

- Missing `JWT_SECRET`.
- Expired authentication token.
- Invalid JWT configuration.

---

## Port Already in Use

If the configured port is already occupied, either:

- Stop the running process using that port.
- Change the `PORT` value in the `.env` file.

---

# Verifying the Installation

A successful installation should allow you to:

- Register a new user.
- Log in successfully.
- Create a post.
- Upload images.
- Search for users.
- Send messages.
- View the home feed.

---

# Next Steps

After completing the installation, you may refer to the additional documentation for more information.

- Architecture Documentation
- Database Design
- REST API Reference
- Feature Documentation
- Socket.IO Events
