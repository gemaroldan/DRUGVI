import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  path: string;
  title: string;
  description?: string;
  startIcon?: JSX.Element;
  close: () => void;
}

const DrawerItem: React.FC<Props> = ({
  path,
  title,
  description,
  startIcon,
  close,
}) => {
  return (
    <ListItem onClick={close} disablePadding title={description}>
      <ListItemButton component={NavLink} to={path}>
        <ListItemIcon>{startIcon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default DrawerItem;
