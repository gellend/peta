import { io } from "socket.io-client";

const socketInitializer = async () => {
  await fetch("/api/socket");
  const socket = io();

  socket.on("connect", () => {
    console.log("socket connected");
  });
};

export default socketInitializer;
