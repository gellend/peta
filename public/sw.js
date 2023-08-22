// public/sw.js

self.addEventListener("install", function (event) {
  console.log("Hello from service worker!");
});

self.addEventListener("push", function (event) {
  if (event.data) {
    let options = {
      body: event.data.text(),
    };

    self.registration.showNotification("Test Push", options);
  }
});
