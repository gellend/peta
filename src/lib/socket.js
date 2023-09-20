import { useEffect } from "react";
import { io } from "socket.io-client";

let socket;

const useSocket = () => {
  useEffect(() => {
    // Create and initialize the socket when the component mounts
    const socketSetup = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("disconnect", () => {
        console.log("disconnected");
      });
    };

    socketSetup();

    return () => {
      // Cleanup: disconnect the socket when the component unmounts
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return socket;
};

export default useSocket;
