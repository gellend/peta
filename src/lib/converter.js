/**
 * Converts a base64-encoded URL-safe string to a Uint8Array.
 * @param {string} base64String - The base64-encoded string.
 * @returns {Uint8Array} The resulting Uint8Array.
 */
export const urlBase64ToUint8Array = (base64String) => {
  // Ensure proper padding for base64 string
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  // Replace URL-safe characters and padding
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  // Decode base64 string into raw binary data
  const rawData = atob(base64);

  // Create a Uint8Array to store the binary data
  const outputArray = new Uint8Array(rawData.length);

  // Populate the Uint8Array with the decoded binary data
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
