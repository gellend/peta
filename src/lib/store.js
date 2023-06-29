import { createFirebaseApp } from "../../firebase/clientApp";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const app = createFirebaseApp();
const db = getFirestore(app);

export const getUserDataByEmail = async (email) => {
  let user = null;
  const q = query(collection(db, "users"), where("email", "==", email));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    user = doc.data();
  });

  return user;
};

export const getUserDataByUid = async (uid) => {
  try {
    const user = await getDoc(doc(db, "users", uid));
    return user.data();
  } catch (error) {
    console.error("getUserDataByUid:", error);
    throw error;
  }
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

export const postData = async (path, data, id = null) => {
  try {
    const documentRef = id ? doc(db, path, id) : doc(collection(db, path));
    await setDoc(documentRef, data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
