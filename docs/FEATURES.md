# Features

This document provides an overview of the core features available in Dekrof. The application is designed around common social networking functionality while maintaining a modular backend architecture and a responsive user experience.

---

# Authentication

Dekrof uses JSON Web Tokens (JWT) stored in HTTP-only cookies to authenticate users. Protected routes validate the token before granting access to authenticated resources.

### Capabilities

- User registration
- User login
- Secure password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookie storage
- Protected routes
- User logout

---

# User Profiles

Each user has a dedicated profile containing personal information and activity within the platform.

### Capabilities

- View user profiles
- Edit profile information
- Upload profile pictures
- Update profile details
- View follower count
- View following count
- View user posts

---

# Follow System

Users can build their social network by following other users.

### Capabilities

- Follow users
- Unfollow users
- View followers
- View following
- Prevent duplicate follow relationships

---

# Posts

Users can create and share image-based posts with captions.

### Capabilities

- Upload images
- Add captions
- Delete own posts
- Display post creation time
- Infinite scrolling feed

---

# Likes

Posts support user interactions through likes.

### Capabilities

- Like posts
- Remove likes
- Prevent duplicate likes
- Display total likes

---

# Messaging

Dekrof includes a real-time one-to-one messaging system powered by Socket.IO.

### Capabilities

- Create conversations
- Send messages instantly
- Receive messages in real time
- Conversation list
- Latest message preview
- Message timestamps

---

# Search

Users can search for other users using their username.

### Capabilities

- Username search
- Partial username matching
- Direct profile navigation

---

# Notifications

The notification system keeps users informed about important activities on their account.

### Capabilities

- Follow notifications
- Like notifications
- Notification history

---

# Media Management

User-uploaded images are stored using Cloudinary to improve scalability and media delivery.

### Capabilities

- Image uploads
- Cloud-based storage
- Optimized image delivery

---

# Responsive Interface

The application is designed to provide a consistent experience across different screen sizes.

### Highlights

- Infinite scrolling
- Dynamic content updates
- Interactive user interface
- 
---

# Planned Features

The following features are currently under development or planned for future releases.

- Comment system
- Comment replies
- Saved posts
- Typing indicators
- Read receipts
- Online user status
- Group conversations
