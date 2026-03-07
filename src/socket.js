import { io } from "socket.io-client";

// Connect to the BACKEND port (8080)
// The "origin" in your server code refers to THIS app (3000)
const socket = io("https://hirelingbackend.onrender.com");

socket.on("connect", () => {
  console.log("Connected to Backend! ID:", socket.id);
});

export default socket;