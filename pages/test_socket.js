import { useEffect, useState } from "react";
import io from "socket.io-client";
let socket;

const TestSocket = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
    const socketSetup = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("update-input", (msg) => {
        setInput(msg);
      });
    };

    socketSetup();
  }, []);

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  );
};

export default TestSocket;
