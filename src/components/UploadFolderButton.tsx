import { DriveFolderUpload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useRef } from "react";
import { addFolder } from "../firebase";
import { FolderData } from "../actions";

export default function UploadFolderButton({ currentFolder }: { currentFolder: FolderData }) {
  const directoryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (directoryRef.current !== null) {
      directoryRef.current.setAttribute("webkitdirectory", "");
      directoryRef.current.setAttribute("directory", "");
    }
  }, [directoryRef]);

  function submit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    // a bit hacky for now since we're only dealing with Folders, not Files
    if (event.target.files && event.target.files.length > 0) {
      const folderName = event.target.files[0].webkitRelativePath.split("/")[0];

      addFolder(folderName, currentFolder);
    }
  }

  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      startIcon={<DriveFolderUpload />}
    >
      Upload Folder
      <input 
        hidden
        multiple
        type="file"
        onChange={submit}
        ref={directoryRef}
      />
    </Button>
  )
}
