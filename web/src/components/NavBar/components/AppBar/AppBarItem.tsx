import Button from '@mui/material/Button';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';

interface Props {
  path: string;
  title: string;
  description?: string | undefined;
  startIcon?: JSX.Element;
  acceptedTerms?: boolean;
}

// TODO: Add sx to css
const AppBarItem: React.FC<Props> = ({
  startIcon,
  path,
  title,
  description,
  acceptedTerms,
}) => {
  const isDisabled = acceptedTerms === false;

  return (
    <span>
      <Button
        startIcon={startIcon}
        color="inherit"
        title={description}
        component={NavLink}
        to={path}
        variant="menuButton"
        disabled={isDisabled}
        sx={{
          whiteSpace: 'nowrap',
          '&.active': {
            borderBottom: '2px solid #13DEFC',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>{title}</Box>
      </Button>
    </span>
  );
};

export default AppBarItem;
