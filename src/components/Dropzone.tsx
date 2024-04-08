import { useCallback } from "react"
import { FileWithPath, useDropzone } from "react-dropzone";
import { FolderData } from "../actions";
import { addFolder } from "../firebase";

export default function Dropzone({ currentFolder }: { currentFolder: FolderData }) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const folders = new Set<string>();

    // Future TODO: right now this dropzone only uploads the folder if it contains at least 1 file
    // due to the limitations of this library.
    // Admittedly strange behavior since this app only handles files for now,
    // could be an experience to improve in the future
    acceptedFiles.forEach((file: FileWithPath) => {
      if (file.path) {
        folders.add(file.path.split("/")[1])
      }

      folders.forEach((folder: string) => {
        addFolder(folder, currentFolder);
      });
    });
  }, [currentFolder])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true})

  return (
    <div {...getRootProps()} style={{
      width: '100%',
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
