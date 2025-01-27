const { Server } = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 8080;

//Create Socket.IO Server Instance
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//Storage for tasks
let tasks = [];

//When new client is connected
io.on("connection", (socket) => {
  //Send all tasks to new client
  socket.emit("init", tasks);

  //When new task is added
  socket.on("addTask", (task) => {
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });

  //When task is updated
  socket.on("completeTask", ({ id, status }) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: status } : task
    );
    socket.broadcast.emit("completeTask", { id, status });
  });

  //When task is deleted
  socket.on("deleteTask", (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    socket.broadcast.emit("deleteTask", id);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
