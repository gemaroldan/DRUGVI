import { Button } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  path: string;
  title: string;
  description?: string | undefined;
  startIcon?: JSX.Element;
}

const AppBarItemLogo: React.FC<Props> = ({
  startIcon,
  path,
  title,
  description,
}) => {
  return (
    <Button
      startIcon={startIcon}
      color="inherit"
      title={description}
      component={NavLink}
      to={path}
      variant="menuButtonLogo"
      sx={{
        whiteSpace: 'nowrap',
      }}
    >
      {title}
    </Button>
  );
};

export default AppBarItemLogo;
