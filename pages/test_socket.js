import { useEffect } from "react";
import socketInitializer from "../src/lib/socket";

export default function TestSocket() {
  useEffect(() => {
    socketInitializer();
  }, []);

  return <h1>Hello Socket.io</h1>;
}
