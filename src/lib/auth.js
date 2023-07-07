import { createFirebaseApp } from "../../firebase/clientApp";
import { getAuth } from "firebase/auth";
import useAppStore from "../store/global";

const app = createFirebaseApp();
export const auth = getAuth(app);

const fetchCurrentUser = useAppStore.getState().fetchCurrentUser;
const handleOpenSnackBar = useAppStore.getState().handleOpenSnackBar;
const setIsLoading = useAppStore.getState().setIsLoading;

export const observeAuthState = async (redirect = true) => {
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
        if (redirect) window.location.href = "/";

        resolve(null);
      }
    });
  });
};

export const getCurrentLoginUser = async (redirectIfEmpty = true) => {
  try {
    setIsLoading(true);
    const user = await observeAuthState(redirectIfEmpty);
    if (user) fetchCurrentUser(user.email);
  } catch (error) {
    handleOpenSnackBar(error.message, "error");
  } finally {
    setIsLoading(false);
  }
};
