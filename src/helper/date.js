export default function getCurrentTimestamp() {
  const now = new Date();

  // Get the date components
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  // Get the time components
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Assemble the timestamp
  const timestamp = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
  return timestamp;
}
