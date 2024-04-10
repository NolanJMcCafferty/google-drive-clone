import { useCallback } from "react"
import { FileWithPath, useDropzone } from "react-dropzone";
import { FolderData } from "../actions";
import { addFolderTree } from "../firebase";
import { FolderTreeNode } from "../common";


export default function Dropzone({ currentFolder }: { currentFolder: FolderData }) {

  function createFolderTree(paths: Set<string>): FolderTreeNode {
    const root: FolderTreeNode = {
      name: "root",
      children: []
    }

    paths.forEach(path => {
      const folders = path.split("/");
      let currentNode = root;

      folders.forEach(folder => {
        let existingNode = currentNode.children.find(child => child.name === folder);

        if (existingNode) {
          currentNode = existingNode;
        } else {
          const newNode: FolderTreeNode = {
            name: folder,
            children: []
          }

          currentNode.children.push(newNode);
          currentNode = newNode;
        }
      });
    });

    return root;
  }


  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // add all nested Folders to Firebase, as long as the folder contains a file
    const paths = new Set<string>();

    acceptedFiles.forEach((file: FileWithPath) => {
      if (file.path) {
        paths.add(file.path.split("/").slice(1, -1).join("/"));
      }
    });

    const root = createFolderTree(paths);

    root.children.forEach(child => {
      addFolderTree(child, currentFolder);
    })
  }, [currentFolder])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true})

  return (
    <div {...getRootProps()} style={{
      width: '90%',
      height: '30vh',
      backgroundColor: isDragActive ? 'lightblue' : 'transparent',
      border: isDragActive ? '2px solid darkblue' : '1px dashed black',
      borderRadius: 20,
      textAlign: 'center'
    }}>
      <input {...getInputProps()} />
      <p>Drop folders here</p>
    </div>
  )
}
