import { CreateNewFolder } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { addFolder } from "../firebase";
import { FolderData } from "../actions";

export default function CreateFolderButton({ currentFolder }: { currentFolder: FolderData }) {
  const [open, setOpen] = useState(false);

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function submitCreateForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const folderName = Object.fromEntries((formData as any).entries()).name;

    addFolder(folderName, currentFolder);
    closeDialog();
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<CreateNewFolder />}
        onClick={openDialog}
      >
        Create Folder
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => submitCreateForm(event)
        }}
      >
        <DialogTitle>New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="name"
            name="name"
            variant="standard"
            placeholder="Untitled folder"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
