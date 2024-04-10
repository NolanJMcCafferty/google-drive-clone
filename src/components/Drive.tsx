import { Grid, Stack, Typography } from "@mui/material";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import CreateFolderButton from "./CreateFolderButton";
import UploadFolderButton from "./UploadFolderButton";
import FolderCard from "./FolderCard";
import { useParams } from "react-router-dom";
import Dropzone from "./Dropzone";
import { useFolder } from "../hooks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SideNav from "./SideNav";

export default function Drive() {
  const { folderId } = useParams();
  const { folder, childFolders } = useFolder(folderId ? folderId : null);

  return (
    <Grid container>
      <Grid item xs={2}>
        <SideNav />
      </Grid>
      <Grid item xs={10} sx={{ pt: 3 }}>
        <Stack spacing={5}>
          <Stack spacing={1}>
            <FolderBreadcrumbs currentFolder={folder}/>
            <Stack spacing={2} direction="row">
              <CreateFolderButton currentFolder={folder}/>
              <UploadFolderButton currentFolder={folder}/>
            </Stack>
          </Stack>
          {childFolders && childFolders.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="h6">Folders</Typography>
              <DndProvider backend={HTML5Backend}>
                <Grid container columnGap={1} rowGap={2}>
                  {childFolders.map((childFolder) => (
                    <Grid item xs={3} key={childFolder.id}>
                      <FolderCard folder={childFolder}/>
                    </Grid>
                  ))}
                </Grid>
              </DndProvider>
            </Stack>
          ) : (
            <Dropzone currentFolder={folder}/>
          )}
        </Stack>
      </Grid>
    </Grid>
  )
}
