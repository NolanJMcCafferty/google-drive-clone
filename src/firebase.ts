import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { FolderData, PathItem } from "./actions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export async function addFolder(folderName: string, parent: FolderData) {
  // check if folder already exists with that name
  const q = query(
    collection(db, "folders"),
    where("name", "==", folderName),
    where("parentId", "==", parent.id),
    where("userId", "==", auth.currentUser?.uid));

  const existingFolders = await getDocs(q);

  if (!existingFolders.empty) {
    alert("A folder with this name already exists.");
    return;
  }

  await addDoc(collection(db, "folders"), {
    name: folderName,
    userId: auth.currentUser?.uid,
    parentId: parent ? parent.id : null,
    path: parent ? [...parent.path, { id: parent.id, name: parent.name }] : []
  });
}

export async function renameFolder(folderId: string, name: string) {
  await updateDoc(doc(db, "folders", folderId),
    { name: name }
  );
}

export async function deleteFolder(folderId: string) {
  const childFolders = getChildFolders(folderId);

  (await childFolders).forEach(childFolder => {
    deleteFolder(childFolder.id);
  })

  await deleteDoc(doc(db, "folders", folderId));
}

export async function moveFolder(folderId: string, newParentId: string | null) {
  let newPath: PathItem[] = [];
  if (newParentId != null) {
    const newParent = await getDoc(doc(db, "folders", newParentId));
    const newParentData = newParent.data();

    if (newParentData) {
      newPath = [...newParentData.path, { id: newParentId, name: newParentData.name }]
    }
  }

  await updateDoc(doc(db, "folders", folderId), {
    parentId: newParentId,
    path:  newPath,
  });

  const childFolders = getChildFolders(folderId);
  (await childFolders).forEach(childFolder => {
    moveFolder(childFolder.id, folderId);
  })
}

async function getChildFolders(folderId: string) {
  const q = query(
    collection(db, "folders"),
    where("parentId", "==", folderId),
    where("userId", "==", auth.currentUser?.uid));

    return await getDocs(q);
}