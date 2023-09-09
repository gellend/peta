import { Button, Container, Stack, TextField } from "@mui/material";
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

  const handleSendNotification = () => {
    if (!input) return;

    socket.emit("send-notification", {
      title: "Hello",
      body: "This is a notification",
      subscription: input,
    });
  };

  return (
    <Container sx={{ maxWidth: "400px" }}>
      <Stack direction="column">
        <TextField
          sx={{ my: 2 }}
          placeholder="Type something"
          value={input}
          onChange={onChangeHandler}
        />

        <Button onClick={handleSendNotification}>Send Notification</Button>
      </Stack>
    </Container>
  );
};

export default TestSocket;
