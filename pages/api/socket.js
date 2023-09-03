import { Server } from "socket.io";
import webpush from "web-push";

export default async (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    const vapidKeys = {
      publicKey: process.env.NEXT_VAPID_PUBLIC_KEY,
      privateKey: process.env.NEXT_VAPID_PRIVATE_KEY,
    };

    webpush.setVapidDetails(
      "mailto:hi@gellen.page",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    io.on("connection", (socket) => {
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
      });

      socket.on("send-notification", (msg) => {
        if (!msg && msg.length === 0) {
          console.log("No message to send");
          return;
        }

        const subscription = msg.subscription;
        const message = JSON.stringify({
          title: msg.title,
          body: msg.body,
        });

        console.log("subscription", subscription);
        console.log("msg", message);

        try {
          webpush.sendNotification(subscription, message);
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      });
    });
  }

  res.status(200).end();
};
