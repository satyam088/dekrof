# Socket.IO Events

## Purpose

This document describes the real-time communication layer used by Dekrof. Socket.IO enables bidirectional communication between connected clients and the server, providing real-time messaging and user presence.

---

# Overview

Socket.IO is primarily used for the messaging system. It enables users to exchange messages instantly without requiring the page to be refreshed.

The server maintains active socket connections and routes events between participants in a conversation.

---

# Connection Lifecycle

## Client Connection

When a user opens the application, a Socket.IO connection is established with the server.

```
Client
    │
    ▼
Socket.IO Server
```

---

## Client Disconnection

When the user closes the application or loses network connectivity, the socket connection is terminated.

```
Client
    │
Disconnect
    │
    ▼
Socket.IO Server
```

---

# Event Flow

```
User A
   │
   │  send-message
   ▼
Socket.IO Server
   │
   │
   ▼
MongoDB
   │
   ▼
Socket.IO Server
   │
   │ receive-message
   ▼
User B
```

Messages are persisted before being delivered to ensure reliability and consistency.

---

# Client Events

The following events are emitted by the client.

---

## join-conversation

Joins the socket to a  room same as username of user.

### Payload

```json
{
    "conversationId": "..."
}
```

### Purpose

Allows the server to send events only to users participating in the conversation.

---

## send-message

Requests the server to create and deliver a new message.

### Payload

```json
{
    "conversation": "...",
    "receiver": "Hello",
    "message" :"...",
}
```

### Server Responsibilities (partiall done)

- Validate payload
- Store the message
- Update conversation metadata
- Notify participants

---

# Server Events

The following events are emitted by the server.

---

## receive-message

Broadcasts a newly created message to conversation participants.

### Payload

```json
{
    "messageId": "...",
    "conversationId": "...",
    "sender": "...",
    "recever":"..."
    "message": "...",
    "createdAt": "..."
}
```

---

## conversation-updated

Sent whenever the latest message or conversation metadata changes.

### Purpose

Allows the client to update:( still in progress)

- Last message preview
- Conversation order
- Message timestamp

---

# Socket Rooms

Each authenticated user joins a dedicated Socket.IO room identified by their username immediately after establishing a connection.

This approach allows the server to deliver real-time events directly to a specific user without broadcasting to all connected clients.

```
                Socket.IO Server
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   Room: alice    Room: bob    Room: charlie
        │             │             │
     User A        User B        User C
```

## Advantages

- Enables direct user-to-user communication.
- Simplifies event delivery to specific users.
- Eliminates unnecessary broadcasts.
- Supports multiple simultaneous connections for the same user.

When a message is sent, the server identifies the recipient and emits the event to the recipient's room. Only clients connected to that room receive the event.

Using rooms ensures that events are only delivered to users participating in a conversation.

---

# Authentication

Only authenticated users are permitted to establish a socket connection.

Authentication information is validated before allowing access to protected socket events.

---

# Error Handling (partially done)

Invalid events are rejected by the server.

Examples include:

- Invalid conversation ID
- Unauthorized user
- Empty message
- Invalid payload

---

# Scalability Considerations (still in progress)

The messaging architecture is designed to support future enhancements, including:

- Typing indicators
- Read receipts
- Online presence
- Message reactions
- Media attachments
- Group conversations

---

# Summary

Socket.IO provides the real-time communication layer of Dekrof. Messages are validated, persisted in MongoDB, and delivered to connected participants through conversation-specific rooms, ensuring reliable and efficient message delivery.
