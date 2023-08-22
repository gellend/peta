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
  documentId,
} from "firebase/firestore";

const app = createFirebaseApp();
const db = getFirestore(app);

// Common Function
export const postData = async (path, data, id = null) => {
  try {
    const documentRef = id ? doc(db, path, id) : doc(collection(db, path));
    await setDoc(documentRef, data);
    return true;
  } catch (error) {
    console.error("postData:", error);
    return false;
  }
};

export const getDataWithQuery = async (
  path,
  column,
  operator,
  key,
  withDocId = true
) => {
  let data = [];
  try {
    const q = query(collection(db, path), where(column, operator, key));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (withDocId) {
        data.push({ ...doc.data(), docId: doc.id });
      } else {
        data.push(doc.data());
      }
    });

    return data;
  } catch (error) {
    console.error("getDataWithQuery:", error);
    return data;
  }
};

export const getUserDataByEmail = async (email) => {
  const rows = await getDataWithQuery("users", "email", "==", email);
  const mappedRows = rows.map((row) => {
    const { docId, ...rest } = row;
    return { uid: docId, ...rest };
  });
  return mappedRows[0];
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

export const getUserPushSubscriptionByUid = async (uid) => {
  try {
    const user = await getDoc(doc(db, "subscription", uid));
    return user.data();
  } catch (error) {
    console.error("getUserDataByUid:", error);
    throw error;
  }
};

export const getUsersByRoles = async (roles) => {
  try {
    const users = await getDataWithQuery("users", "role", "in", roles);

    return users;
  } catch (error) {
    console.error("getUsersByRoles:", error);
    throw error;
  }
};

export const getPengajuanByCurrentUser = async (email) => {
  const rows = await getDataWithQuery("pengajuan", "email", "==", email);
  return rows;
};

export const getDetailPengajuan = async (docId) => {
  const rows = await getDataWithQuery(
    "pengajuan",
    documentId(),
    "==",
    docId,
    true
  );
  return rows[0];
};

// Store user's push subscription in Firestore
export const storePushSubscription = async (userId, subscription) => {
  try {
    const documentRef = doc(db, "subscriptions", userId);
    await setDoc(documentRef, { subscription });
    return true;
  } catch (error) {
    console.error("storePushSubscription:", error);
    return false;
  }
};

export const getPushSubscription = async (userId) => {
  try {
    const rows = await getDataWithQuery(
      "subscriptions",
      documentId(),
      "==",
      userId,
      false
    );
    return rows[0];
  } catch (error) {
    console.error("getPushSubscription:", error);
    return null;
  }
};
