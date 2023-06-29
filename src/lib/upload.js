import { createFirebaseApp } from "../../firebase/clientApp";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const app = createFirebaseApp();
const storage = getStorage(app);

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
  } catch (error) {
    console.error(`uploadFile: Error uploading ${file}:`, error);
    throw error;
  }
};
