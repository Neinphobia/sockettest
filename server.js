const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const sillyNames = [
  "Banana Bread",
  "Cucumber Cool",
  "Doughnut Dancer",
  "Eggplant Enthusiast",
  "Fruit Fanatic",
  "Grape Guru",
  "Honey Honey",
  "Ice Cream Innovator",
  "Jelly Jester",
  "Kiwi King",
  "Lemon Lover",
  "Mango Muncher",
  "Lemonade Mouth",
  "Nut Nut",
  "Orange Orator",
  "Pineapple Pioneer",
  "Quince Quest",
  "Raspberry Ranger",
  "Strawberry Star",
  "Tangerine Titan",
  "Umbrella Unicorn",
  "Vanilla Visionary",
  "Watermelon Whisperer",
  "Xylophone Xpert",
  "Yogurt Yogi",
  "Zucchini Zealot",
];

let connectedUsers = [];

app.use(express.static("public"));
io.on("connection", (socket) => {
  // Step 2: Update the List on Connection and Disconnection
  const sillyName = sillyNames[Math.floor(Math.random() * sillyNames.length)];
  const rand = Math.floor(Math.random() * 2024);
  connectedUsers.push({ id: socket.id, name: sillyName + " " + rand });

  console.log("a user connected: ", sillyName + " " + rand);

  socket.on("chat message", (msg) => {
    const user = connectedUsers.find((u) => u.id === socket.id);
    io.emit("chat message", { msg, sillyName: user.name });
  });

  socket.on("change name", (data) => {
    // Verify that the ID sent with the request matches the ID of the client making the request
    if (data.id === socket.id) {
      const user = connectedUsers.find((u) => u.id === data.id);
      if (user) {
        user.name = data.newName;
        // Emit the updated users list to all clients
        io.emit("users list", connectedUsers);
      }
    } else {
      console.log("Unauthorized name change attempt");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Remove the user from the list
    connectedUsers = connectedUsers.filter((u) => u.id !== socket.id);
    // Optionally, emit the updated users list
    io.emit("users list", connectedUsers);
  });
});

// Optionally, emit the list of connected users periodically
setInterval(() => {
  io.emit("users list", connectedUsers);
}, 5000); // Emit every 5 seconds

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
