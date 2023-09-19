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

export const getDataFromCollection = async (path) => {
  let data = [];
  try {
    const querySnapshot = await getDocs(collection(db, path));
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), docId: doc.id });
    });
    return data;
  } catch (error) {
    console.error("getDataFromCollection:", error);
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

export const getUsersByRoles = async (roles) => {
  try {
    const users = await getDataWithQuery("users", "role", "in", roles);

    return users;
  } catch (error) {
    console.error("getUsersByRoles:", error);
    throw error;
  }
};

export const getPengajuanByMahasiswa = async (email) => {
  const rows = await getDataWithQuery("pengajuan", "email", "==", email);
  return rows;
};

export const getPengajuanByDosen = async (id) => {
  const rows1 = await getDataWithQuery(
    "pengajuan",
    "dosenPembimbing1",
    "==",
    id
  );
  const rows2 = await getDataWithQuery(
    "pengajuan",
    "dosenPembimbing2",
    "==",
    id
  );
  const rows3 = await getDataWithQuery(
    "pengajuan",
    "dosenPembimbing3",
    "==",
    id
  );
  const rows = [...rows1, ...rows2, ...rows3];
  return rows;
};

export const getPengajuanByKepalaProdi = async (prodi) => {
  const rows = await getDataWithQuery("pengajuan", "prodi", "==", prodi);
  return rows;
};

export const getPengajuanByKoordinator = async (lab) => {
  const rows = await getDataWithQuery("pengajuan", "lab", "==", lab);
  return rows;
};

export const getPengajuanByAdmin = async (email) => {
  const rows = await getDataFromCollection("pengajuan");
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
