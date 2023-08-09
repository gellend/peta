import { Server } from "socket.io";

export default async (req, res) => {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server;

    const io = new Server(httpServer, {
      /* Additional options if needed */
    });

    console.log("Initializing socket.io...");

    res.socket.server.io = io;
  }

  res.status(200).end();
};
