# Real-Time Task Collaboration App Backend

This project is back-end part for Real-Time Task Collaboration App.

Used Socket.IO for WebSocket communication and stored tasks in JavaScript Object.

Implemented the synchronization all of the client states with minimal traffic data.

## Running Project

```bash
npm install
npm run start
```

Project Environment:

- Node.js 18+
- Socket.IO 4.8

## Project Structure

Create Socket.IO server instance.

```javascript
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
```

For each client connected to the server, server initialize client's state by sending whole tasks.

```javascript
  socket.emit("init", tasks);
```

After connection is successful, server listens for update events from clients.

When event occurs, server broadcast WebSocket messages except sender.

For example, "addTask" event is processed by

```javascript
  socket.on("addTask", (task) => {
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });
```

