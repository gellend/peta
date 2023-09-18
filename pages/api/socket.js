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
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
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
        console.log("send-notification", msg);

        if (!msg || !msg.subscription) {
          console.log("No payload or subscription");
          return;
        }

        const subscription = JSON.parse(msg.subscription);

        if (!subscription || !subscription.endpoint) {
          console.log("Invalid subscription");
          return;
        }

        const message = JSON.stringify({
          title: msg.title,
          body: msg.body,
        });

        webpush
          .sendNotification(subscription, message)
          .then(
            (result) => {
              console.log("sendNotification result", result);
            },
            (error) => {
              console.error("sendNotification error", error);
            }
          )
          .catch((err) => {
            console.error("sendNotification catch", err);
          });
      });
    });
  }

  res.status(200).end();
};
