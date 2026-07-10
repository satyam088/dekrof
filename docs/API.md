# REST API

This document describes the REST API exposed by Dekrof. The API is responsible for user authentication, profile management, social interactions, post management, messaging, and notifications.

---

# Base URL

```
http://localhost:3000/
```

---

# Authentication

Authentication is implemented using **JSON Web Tokens (JWT)** stored in **HTTP-only cookies**. Protected routes require a valid authentication token.

---

# Authentication Endpoints

## Register User

Creates a new user account.

### Endpoint

```http
POST /user/create
```

### Request Body

```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Response

```json
{
    "success": true,
    "message": "Account created successfully."
}
```

---

## Login

Authenticates an existing user.

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Response

```json
{
    "success": true,
    "message": "Login successful."
}
```

---

## Logout

Terminates the authenticated session.

### Endpoint

```http
GET /auth/logout 
```

---
(Later be changed to POST)

# User Endpoints

## Get Profile

Returns information about a user.

### Endpoint

```http
GET /user/view/:username
```

---

## Edit Profile

Updates user profile information.

### Endpoint

```http
POST /user/update
```

---

## Follow User

Follow another user.

### Endpoint

```http
POST /user/follow/:username
```

---

## Unfollow User

Remove an existing follow relationship.

### Endpoint

```http
DELETE /user/follow/:username
```

---

# Post Endpoints

## Create Post

Creates a new post.

### Endpoint

```http
POST /posts
```

### Content Type

```
multipart/form-data
```

---

## Get Feed

Returns the latest posts.

### Endpoint

```http
GET /feed
```

---

## Delete Post

Deletes a post created by the authenticated user.

### Endpoint

```http
POST /posts/:postId 
```

---
(later to change delete)
## Like Post

Adds a like to a post.

### Endpoint

```http
POST /posts/like/:postId
```

---

## Unlike Post

Removes an existing like.

### Endpoint

```http
POST /posts/like/:postId
```

---

# Conversation Endpoints

## Get Conversations

Returns all conversations belonging to the authenticated user.

### Endpoint

```http
GET /messages/:username
```

---

## Create Conversation

Creates a new conversation between two users.
// still in progress
### Endpoint

```http
POST /conversations
```

---

# Message Endpoints

## Get Messages

Returns all messages from a conversation.

### Endpoint

```http
GET /get/:conversationId/:lastMessageId
```

---

## Send Message

Creates a new message.

### Endpoint

```http
Handled By socket io event
```

---

# Notification Endpoints (// still in progress)

## Get Notifications

Returns notifications for the authenticated user.

### Endpoint

```http
GET /notifications
```

---

## Mark Notification as Read

Marks a notification as read.

### Endpoint

```http
PATCH /notifications/:notificationId
```

---

# Search Endpoints

## Search Users

Search users by username.

### Endpoint

```http
GET /search?query=<username>
```

---

# HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request completed successfully |
| 201 | Resource created successfully |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Access denied |
| 404 | Resource not found |
| 500 | Internal server error |

---

# Error Response

Example error response returned by the API.

```json
{
    "success": false,
    "message": "Resource not found."
}
```
