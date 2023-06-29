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

export const getUsersByRoles = async (roles) => {
    try {
        const q = query(collection(db, "users"), where("role", "in", roles));
        const querySnapshot = await getDocs(q);
        const users = [];

        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
