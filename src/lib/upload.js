import { createFirebaseApp } from "../../firebase/clientApp";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const app = createFirebaseApp();
const storage = getStorage(app);

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    console.info(`${path} uploaded successfully!`);
  } catch (error) {
    console.error(`Error uploading ${file}:`, error);
    throw error;
  }
};
