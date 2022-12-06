import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { createFirebaseApp } from "../firebase/clientApp";
import { useRouter } from "next/router";

export const UserContext = createContext();

export default function UserContextComp({ children }) {
  const app = createFirebaseApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.data();
  };

  useEffect(() => {
    const unsubscriber = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(getUserData(user.uid));
        } else {
          setUser(null);
          router.push("/");
        }
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
