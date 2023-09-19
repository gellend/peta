import { createFirebaseApp } from "../../firebase/clientApp";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { saveAs } from "file-saver";

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

export const downloadFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);

    const response = await axios({
      url: url,
      method: "GET",
      responseType: "blob",
    });

    saveAs(response.data, path);

    return url;
  } catch (error) {
    console.error(`downloadFile: Error downloading ${path}:`, error);
    throw error;
  }
};

export const generateDownloadUrl = async (path, callback) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);

    callback(url);
  } catch (error) {
    console.error(`generateDownloadUrl error`, error);
    throw error;
  }
};
