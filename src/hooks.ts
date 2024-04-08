import { useEffect, useReducer } from "react";
import { FolderAction, FolderData, setChildFolders, setFolder } from "./actions";
import { DocumentSnapshot, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";

const BASE_FOLDER: FolderData = {
  id: null,
  parentId: null,
  name: "Drive",
  path: [],
}

interface FolderState {
  folder: FolderData,
  childFolders: FolderData[]
}

const initialState: FolderState = {
  folder: BASE_FOLDER,
  childFolders: []
}

function folderWithId(doc: DocumentSnapshot): FolderData {
  return {
    id: doc.id,
    name: doc.data()?.name,
    parentId: doc.data()?.parentId,
    path: doc.data()?.path
  }
}

function folderReducer(state = initialState, action: FolderAction) {
  switch(action.type) {
    case 'SET_FOLDER':
      return {...state, folder: action.folder }
    case 'SET_CHILD_FOLDERS':
      return {...state, childFolders: action.childFolders }
    default:
      return state;
  }
}

export function useFolder(folderId: string | null) {
  const [state, dispatch] = useReducer(folderReducer, initialState);

  useEffect(() => {
    if (folderId == null) {
      return dispatch(setFolder(BASE_FOLDER));
    }

    getDoc(doc(db, "folders", folderId))
      .then(doc => {
        dispatch(setFolder(folderWithId(doc)));
      })
      .catch(() => {
        // default to BASE Folder
        dispatch(setFolder(BASE_FOLDER));
      });
  }, [folderId])

  useEffect(() => {
    const q = query(
      collection(db, "folders"),
      where("parentId", "==", folderId),
      where("userId", "==", auth.currentUser ? auth.currentUser.uid : null));

      return onSnapshot(q, snapshot => {
        dispatch(setChildFolders(snapshot.docs.map(folderWithId)));
      });
  }, [folderId])

  return state;
}