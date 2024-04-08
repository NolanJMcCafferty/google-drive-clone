import { Breadcrumbs, Link, LinkProps, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FolderData } from "../actions";
import { Link as RouterLink } from "react-router-dom";

export default function FolderBreadcrumbs({ currentFolder }: { currentFolder: FolderData }) {
  interface LinkRouterProps extends LinkProps {
    to: string;
  }

  function LinkRouter(props: LinkRouterProps) {
    return <Link {...props} component={RouterLink as any} />
  }

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {currentFolder && currentFolder.path && currentFolder.path.map((pathItem, index) => (
        <LinkRouter
          underline="hover"
          color="inherit"
          to={index === 0 ? `/drive` : `/drive/folders/${pathItem.id}`}
          key={pathItem.id}
        >
          {pathItem.name}
        </LinkRouter>
      ))}
      <Typography color="textPrimary">{currentFolder.name}</Typography>

    </Breadcrumbs>
  )
}
