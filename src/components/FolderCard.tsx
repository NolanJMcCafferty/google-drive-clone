import { Folder, MoreVert } from "@mui/icons-material";
import { Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { FolderData } from "../actions";
import { useNavigate } from "react-router-dom";
import { deleteFolder, moveFolder, renameFolder } from "../firebase";
import { useDrag, useDrop } from "react-dnd";

const FOLDER_CARD = "folder-card";

function FolderCardHeader({ folder }: { folder: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center"
    }}>
        <Folder sx={{ pr: 1 }}/>
        {folder}
    </div>
  )
}
export default function FolderCard({ folder }: { folder: FolderData }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  function closeRenameDialog() {
    setOpenDialog(false);
  }

  function handleRename() {
    closeMenu();
    setOpenDialog(true);
  }

  function handleDelete() {
    closeMenu();
    deleteFolder(folder.id!);
  }

  function submitRenameForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const folderName = Object.fromEntries((formData as any).entries()).name;

    renameFolder(folder.id!, folderName);
    closeRenameDialog();
  }

  function handleDoubleClick() {
    navigate(`/drive/folders/${folder.id}`);
  }

  const [, dragRef] = useDrag(() => ({
    type: FOLDER_CARD,
    item: { folder: folder },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  }))

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: FOLDER_CARD,
    drop: (droppedItem: { folder: FolderData }) => moveToThisFolder(droppedItem.folder),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }), [])

  function moveToThisFolder(droppedFolder: FolderData) {
    if (droppedFolder.id !== folder.id) {
      moveFolder(droppedFolder.id!, folder.id);
    }
  }

  return (
    <div ref={dropRef}>
      <Card
        ref={dragRef}
        style={{
          border: isOver ? '2px solid black' : '0px',
          height: 50,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
          }
        }}
        onDoubleClick={handleDoubleClick}
      >
        <CardHeader
          action={
            <>
              <IconButton
                aria-label="settings"
                onClick={openMenu}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleRename}>Rename</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          }
          subheader={<FolderCardHeader folder={folder.name} />}
        />
        <Dialog
          open={openDialog}
          onClose={closeRenameDialog}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => submitRenameForm(event)
          }}
        >
          <DialogTitle>Rename Folder</DialogTitle>
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
            <Button onClick={closeRenameDialog}>Cancel</Button>
            <Button type="submit">Rename</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  )
}
