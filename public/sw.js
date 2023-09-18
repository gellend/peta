// public/sw.js

self.addEventListener("install", function (event) {
  console.log("Hello from service worker!");
});

self.addEventListener("activate", function (event) {
  console.log("Service worker activating...");
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("New push notification");

    let payload = event.data.json();

    let options = {
      body: payload.body,
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
  }
});
