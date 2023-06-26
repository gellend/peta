import { createFirebaseApp } from "../../firebase/clientApp";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const app = createFirebaseApp();
const db = getFirestore(app);

export const getUserDataByEmail = async (email) => {
    let user = null
    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data()
    });

    return user;
};