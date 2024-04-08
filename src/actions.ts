
export interface PathItem {
  id: string,
  name: string,
}

export interface FolderData {
  id: string | null,
  name: string,
  parentId: string | null,
  path: PathItem[]
}

export type FolderAction = 
  | { type: 'SET_FOLDER'; folder: FolderData }
  | { type: 'SET_CHILD_FOLDERS'; childFolders: FolderData[] }

export function setFolder(folder: FolderData): FolderAction {
  return { type: 'SET_FOLDER', folder }
}

export function setChildFolders(childFolders: FolderData[]): FolderAction {
  return { type: 'SET_CHILD_FOLDERS', childFolders }
}