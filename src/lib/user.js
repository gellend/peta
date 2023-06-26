import { useEffect, useState } from 'react';
import { createFirebaseApp } from "../../firebase/clientApp";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = createFirebaseApp();
const db = getFirestore(app);
const auth = getAuth(app);

export const useAuthState = () => {
    const [user, setUser] = useState(null);

    // Loading user is a state for fetching user data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log(44, user)
            if (user) {
                const userData = await getDoc(doc(db, "users", user.uid));
                setUser(userData.data());
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { user: user || null, isLoading: loading };
};