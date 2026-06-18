# Realtime Kanban Board – LimitlessCNC Home Assignment

A small realtime collaborative Kanban board built as a fullstack home assignment.

The app demonstrates the same Kanban UI implemented with multiple client-side state management approaches, while sharing the same backend and WebSocket protocol.

## Tech Stack

### Client

* React
* TypeScript
* Vite
* WebSocket client
* Zustand
* React Context + Reducer
* React Local State

### Server

* Node.js
* Express
* TypeScript
* ws WebSocket library
* In-memory state

## Features

* Single Kanban board with three columns:

  * To Do
  * In Progress
  * Done
* Create, edit, delete cards
* Move cards between columns using a status selector
* Filter cards by text
* Realtime updates across connected clients
* Presence indicator for connected users
* Optimistic updates on local actions
* In-memory backend state, no database

## Architecture

The application shares the same UI, WebSocket communication layer and backend across all implementations.

Only the state management layer changes.

## Architecture

```txt
Client
├── components          (shared UI)
├── services            (WebSocket communication)
├── types               (shared domain models)
└── state
    ├── hooks/useLocalBoard
    ├── context
    └── store           (Zustand)

Backend
├── WebSocket Server
├── Event Handlers
└── In-Memory Board State

## Running the App

Install dependencies:

```bash
npm install
```

Run the full stack using Docker:

docker compose up --build

If running client and server separately:

```bash
cd backend
npm install
npm run dev
```

```bash
cd react-board
npm install
npm run dev
```

Client runs on:

```
http://localhost:5173
```

Server runs on:

```
http://localhost:8000
```

## Switching State Management Implementations

The implementation can be selected directly from the browser URL using the `mode` query parameter.

### Zustand

```
http://localhost:5173/?mode=zustand
```

### React Context + Reducer

```
http://localhost:5173/?mode=context
```

### React Local State

```
http://localhost:5173/?mode=local
```

All implementations use the same UI and the same backend WebSocket protocol.
The purpose of the assignment is to compare the trade-offs between these approaches while keeping all other application layers identical.

## WebSocket Protocol

The client connects to:

```
ws://localhost:8000
```

### Client Events

#### `user:join`

Sent when a client connects to the board.

```json
{
  "type": "user:join",
  "payload": {
    "id": "user-id",
    "name": "User name"
  }
}
```

#### `card:create`

Creates a new card.

```json
{
  "type": "card:create",
  "payload": {
    "id": "card-id",
    "title": "Card title",
    "description": "Card description",
    "status": "todo",
    "assignee": {
      "id": "user-id",
      "name": "User name"
    },
    "createdAt": "2026-06-18T08:00:00.000Z",
    "updatedAt": "2026-06-18T08:00:00.000Z"
  }
}
```

#### `card:update`

Updates an existing card.

```json
{
  "type": "card:update",
  "payload": {
    "id": "card-id",
    "title": "Updated title",
    "description": "Updated description",
    "status": "in-progress",
    "assignee": {
      "id": "user-id",
      "name": "User name"
    },
    "createdAt": "2026-06-18T08:00:00.000Z",
    "updatedAt": "2026-06-18T08:10:00.000Z"
  }
}
```

#### `card:delete`

Deletes a card.

```json
{
  "type": "card:delete",
  "payload": {
    "id": "card-id"
  }
}
```

### Server Events

#### `init`

Sent immediately after a client connects. Contains the current board state.

```json
{
  "type": "init",
  "payload": {
    "cards": [],
    "users": []
  }
}
```

#### `board:update`

Broadcast after card changes.

```json
{
  "type": "board:update",
  "payload": {
    "cards": [],
    "users": []
  }
}
```

#### `presence:update`

Broadcast when connected users change.

```json
{
  "type": "presence:update",
  "payload": [
    {
      "id": "user-id",
      "name": "User name"
    }
  ]
}
```

Disconnected users are removed automatically when the WebSocket closes.

## State Persistence

The backend stores board state in memory only.

This means:

* Refreshing a client reconnects to the current in-memory board state stored on the server.
* Opening another tab shows the same board state.
* Restarting the server clears all cards and presence data.

This matches the assignment scope: no database or persistence across server restarts is required.

## Design Notes

The backend is intentionally simple. It acts as a shared in-memory event server and broadcasts accepted changes to all connected clients.

Card operations are applied optimistically on the client before server confirmation. The server is assumed to accept all incoming events as specified in the assignment requirements.

The main focus of the assignment is the frontend state comparison. See `JOURNAL.md` for the design journal and recommendation.
