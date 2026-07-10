# Database Design

This document describes the database architecture of Dekrof. The application uses **MongoDB** as its primary database and **Mongoose** as the Object Data Modeling (ODM) library.

The database is designed using normalized collections connected through ObjectId references, allowing efficient querying, scalability, and reduced data duplication.

---

# Database Overview

The application currently consists of the following collections:

- Users
- Posts
- Conversations
- Messages
- Notifications

```
                User
               /    \
              /      \
          Posts    Conversations
             |            |
             |            |
      Notifications    Messages
```

---

# User Collection

The User collection stores account information and maintains relationships with other users and application resources.

## Responsibilities

- Account authentication
- Profile information
- Social relationships
- User activity

## Primary Relationships

| Relationship | Type |
|--------------|------|
| User → Posts | One-to-Many |
| User → Followers | Many-to-Many |
| User → Following | Many-to-Many |
| User → Conversations | Many-to-Many |
| User → Notifications | One-to-Many |

---

# Post Collection

The Post collection stores content published by users.

Each post belongs to a single user and can receive interactions from multiple users.

## Responsibilities

- Image storage reference
- Caption
- Likes
- Creation timestamp

## Primary Relationships

| Relationship | Type |
|--------------|------|
| Post → User | Many-to-One |
| Post → Likes | Many-to-Many |

---

# Conversation Collection

A conversation represents a private chat between users.

Instead of storing every message directly inside the conversation document, only conversation metadata is maintained.

## Stored Information

- Participants
- Last message
- Last message preview
- Last message sender
- Unread message count
- Last activity timestamp

This approach allows conversation lists to load efficiently without retrieving every message.

## Relationships

| Relationship | Type |
|--------------|------|
| Conversation → Messages | One-to-Many |
| Conversation → Participants | Many-to-Many |

---

# Message Collection

Messages contain the actual chat content exchanged between users.

Every message belongs to exactly one conversation.

## Stored Information

- Sender
- Conversation
- Message content
- Creation timestamp

Separating messages into their own collection prevents conversation documents from growing indefinitely.

## Relationships

| Relationship | Type |
|--------------|------|
| Message → User | Many-to-One |
| Message → Conversation | Many-to-One |

---

# Notification Collection

Notifications inform users about activities related to their account.

Examples include:

- New followers
- Post likes

Each notification belongs to a single recipient.

## Relationships

| Relationship | Type |
|--------------|------|
| Notification → User | Many-to-One |

---

# Collection Relationships

```
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Post        Conversation
 │               │
 │               ▼
 │           Message
 │
 ▼
Notification
```

---

# Data Relationships

## User ↔ User

Users maintain follower and following relationships through ObjectId references.

```
User A

Following
    │
    ▼

User B

Followers
```

---

## User → Post

A single user can create multiple posts.

```
User

│

├── Post 1

├── Post 2

└── Post 3
```

---

## Conversation → Message

A conversation contains multiple messages.

```
Conversation

│

├── Message

├── Message

├── Message

└── Message
```

Only the latest message reference is stored in the Conversation collection to optimize chat list rendering.

---

# Database Design Decisions

## Reference-Based Relationships

Instead of embedding large amounts of data, related documents are connected using MongoDB ObjectIds.

Advantages include:

- Reduced document size
- Easier updates
- Improved scalability
- Better query performance

---

## Separate Conversation and Message Collections

Messages are stored independently from conversations.

Benefits:

- Unlimited message history
- Faster conversation queries
- Efficient pagination
- Reduced document growth

---

## Cloud-Based Media Storage

Images are stored in Cloudinary rather than MongoDB.

Only image metadata and URLs are persisted in the database.

Benefits:

- Smaller database size
- Faster media delivery
- Reduced server storage
- Simplified image management

---

# Indexing Strategy

Indexes are used to improve query performance for frequently accessed data.

Examples include:

- User username
- User email
- Conversation participants
- Message conversation
- Notification recipient

Additional indexes may be introduced as the application grows.

---

# Data Integrity

The application maintains consistency by:

- Validating user input before database operations
- Using ObjectId references for relationships
- Preventing duplicate follow relationships
- Preventing duplicate likes
- Removing associated data when required

---

# Future Enhancements

The current database design supports future expansion with minimal structural changes.

Potential additions include:

- Comments
- Comment replies
- Saved posts
- Stories
- Group conversations
- Message attachments
- Read receipts
- User blocking
- Post bookmarks

---

# Summary

Dekrof uses a normalized MongoDB schema that separates major application entities into dedicated collections connected through ObjectId references. This design minimizes data duplication, improves maintainability, and provides a scalable foundation for future development while keeping database queries efficient.
