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
  onSnapshot,
  addDoc,
  serverTimestamp,
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
  if (!uid) return null;

  try {
    const user = await getDoc(doc(db, "users", uid));
    return user.data();
  } catch (error) {
    console.error("getUserDataByUid:", error);
    throw error;
  }
};

export const getUserDataById = async (id) => {
  try {
    const user = await getDataWithQuery("users", "id", "==", id);
    return user[0];
  } catch (error) {
    console.error("getUserById:", error);
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
  const rows = await getDataFromCollection("pengajuan");

  const filteredRows = rows.filter((row) => {
    const { dosenPembimbing1, dosenPembimbing2, dosenPembimbing3 } = row;
    return (
      dosenPembimbing1.id === id ||
      (dosenPembimbing2 && dosenPembimbing2.id === id) ||
      (dosenPembimbing3 && dosenPembimbing3.id === id)
    );
  });

  return filteredRows;
};

export const getPengajuanByKepalaProdi = async (prodi) => {
  const rows = await getDataWithQuery("pengajuan", "prodi", "==", prodi);
  return rows;
};

export const getPengajuanByKoordinator = async (lab) => {
  const rows = await getDataWithQuery("pengajuan", "dosenLab.lab", "==", lab);
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

export const storeNotification = async (notification) => {
  if (!notification) return false;

  try {
    const success = await postData("notifications", notification);
    return success;
  } catch (error) {
    console.error("storeNotification:", error);
    return false;
  }
};

export const streamNotifications = async (uid, callback) => {
  if (!uid) return;

  try {
    const q = query(
      collection(db, "notifications"),
      where("receiver_uid", "==", uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ ...doc.data(), docId: doc.id });
      });
      callback(notifications);
    });
    return unsubscribe;
  } catch (error) {
    console.error("streamNotifications:", error);
    return null;
  }
};

export const findOrGenerateRoomId = async (currentUserUid, dosenUid) => {
  try {
    const userQuery1 = await getDataWithQuery(
      "rooms",
      "users",
      "array-contains",
      currentUserUid
    );
    const userQuery2 = await getDataWithQuery(
      "rooms",
      "users",
      "array-contains",
      dosenUid
    );

    let room;

    userQuery1.forEach((doc1) => {
      userQuery2.forEach((doc2) => {
        if (doc1.docId === doc2.docId) {
          room = doc1.docId;
        }
      });
    });

    if (!room) {
      // Generate a new room
      const newRoomRef = await addDoc(collection(db, "rooms"), {
        users: [currentUserUid, dosenUid],
        createdAt: serverTimestamp(),
      });
      room = newRoomRef.id;
    }

    return room;
  } catch (error) {
    console.error("findOrGenerateRoomId:", error);
    return null;
  }
};

export const streamChatMessages = async (docId, callback) => {
  if (!docId) return;

  try {
    const q = query(collection(db, "rooms"), where(documentId(), "==", docId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ ...doc.data(), docId: doc.id });
      });
      callback(chats);
    });
    return unsubscribe;
  } catch (error) {
    console.error("streamChatMessages:", error);
    return null;
  }
};
