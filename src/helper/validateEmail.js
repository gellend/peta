const isValidEmail = (email) => {
  // You can implement your email validation logic here
  // For simplicity, I'm using a basic regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default isValidEmail;
