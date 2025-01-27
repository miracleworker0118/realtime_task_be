const { Server } = require("socket.io");
const http = require("http");

const PORT = 80;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let tasks = [];

io.on("connection", (socket) => {
  socket.emit("init", tasks);

  socket.on("addTask", (task) => {
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });

  socket.on("completeTask", ({ id, status }) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: status } : task
    );
    socket.broadcast.emit("completeTask", { id, status });
  });

  socket.on("deleteTask", (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    socket.broadcast.emit("deleteTask", id);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Socket.IO server is running on http://localhost:${PORT}`);
});
