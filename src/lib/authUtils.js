import { createFirebaseApp } from "../../firebase/clientApp";
import { getAuth } from "firebase/auth";

const app = createFirebaseApp();
const auth = getAuth(app);

export const observeAuthState = async () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
        });
      } else {
        // It means there is no user logged in
        // Redirect to login page
        window.location.href = "/";

        resolve(null);
      }
    });
  });
};