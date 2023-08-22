// public/sw.js

self.addEventListener("install", function (event) {
  console.log("Hello from service worker!");
});

self.addEventListener("push", function (event) {
  if (event.data) {
    let message = event.data.json().msg;

    let options = {
      body: message.body,
    };

    self.registration.showNotification(message.title, options);
  }
});
