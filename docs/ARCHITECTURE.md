# Application Architecture

This document describes the overall architecture of Dekrof, including its design pattern, application layers, request lifecycle, and system components.

---

# Architecture Overview

Dekrof follows the **Model-View-Controller (MVC)** architectural pattern. The application separates responsibilities into independent layers, making the codebase easier to understand, maintain, and extend.

```
                     Client (Browser)
                            │
                            ▼
                    Express Application
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
     Middleware          Routes           Socket.IO
        │                   │                   │
        └──────────────┬────┴───────────────────┘
                       ▼
                  Controllers
                       │
                       ▼
                    Models
                       │
                       ▼
                    MongoDB
```

---

# Design Pattern

Dekrof is structured using the MVC architecture.

## Model

Models define the structure of the application's data and handle interactions with MongoDB through Mongoose.

Examples include:

- User
- Post
- Conversation
- Message
- Notification

Responsibilities:

- Database schema definitions
- Data validation
- Database queries
- Relationships between collections

---

## View

Views are rendered using **EJS** templates.

Responsibilities:

- Rendering dynamic HTML pages
- Displaying application data
- User interface components
- Reusable partial templates

---

## Controller

Controllers contain the application's business logic.

Responsibilities:

- Processing incoming requests
- Validating user input
- Performing database operations
- Returning rendered pages or API responses

---

## Routes

Routes define the application's public endpoints.

Each route delegates request handling to the appropriate controller after passing through any required middleware.

---

## Middleware

Middleware executes before controllers.

Common responsibilities include:

- Authentication
- Authorization
- File upload processing
- Request validation
- Error handling

---

# Request Lifecycle

The following sequence illustrates how a typical HTTP request is processed.

```
Browser
    │
    ▼
Express Route
    │
    ▼
Authentication Middleware
    │
    ▼
Controller
    │
    ▼
Model
    │
    ▼
MongoDB
    │
    ▼
Controller
    │
    ▼
Rendered View / JSON Response
```

---

# Authentication Flow

Dekrof uses **JWT authentication** with HTTP-only cookies.

```
User Login
      │
      ▼
Credentials Verified
      │
      ▼
JWT Generated
      │
      ▼
Stored in HTTP-only Cookie
      │
      ▼
Browser
      │
      ▼
Subsequent Requests
      │
      ▼
Authentication Middleware
      │
      ▼
JWT Verification
      │
      ▼
Protected Resource
```

---

# Real-Time Messaging Architecture

Real-time communication is implemented using Socket.IO.

```
Client A
     │
     ▼
 Socket.IO Server
     │
     ▼
MongoDB
     │
     ▼
 Socket.IO Server
     │
     ▼
Client B
```

Messages are persisted in MongoDB before being delivered to connected users.

---

# Data Layer

MongoDB serves as the primary database for the application.

The major collections include:

- Users
- Posts
- Conversations
- Messages
- Notifications

Relationships between collections are managed using MongoDB ObjectIds and Mongoose population.

---

# Static Assets

Client-side resources are served from the `public` directory.

This includes:

- Stylesheets (not used in this project , only tailwind css)
- JavaScript files
- Images
- Static assets

---

# Cloud Storage

User-uploaded media is stored in Cloudinary.

Application flow:

```
Browser
    │
    ▼
Express Server
    │
    ▼
Cloudinary
    │
    ▼
Image URL
    │
    ▼
MongoDB
```

Only the generated media URL is stored in the database.

---

# Folder Organization

The project is organized to separate responsibilities across different modules.

```
routes/
│
├── Authentication
├── Users
├── Posts
├── Chats
├── Images
└── Administration

views/
│
├── Pages
└── Partials

public/
│
├── JavaScript
├── Stylesheets
├── Images
└── Assets
```

---

# Scalability Considerations

The architecture is designed to support future enhancements without significant structural changes.

Examples include:

- Comment system
- Nested replies
- Group conversations
- Media sharing
- Notification improvements
- Search optimization
- Additional authentication providers

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | HTML, CSS, JavaScript, Tailwind CSS, EJS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Real-Time Communication | Socket.IO |
| Media Storage | Cloudinary |

---

# Summary

Dekrof adopts a modular MVC architecture that separates presentation, business logic, and data access into distinct layers. This design improves maintainability, promotes code reuse, and provides a solid foundation for extending the application with additional features as it evolves.
