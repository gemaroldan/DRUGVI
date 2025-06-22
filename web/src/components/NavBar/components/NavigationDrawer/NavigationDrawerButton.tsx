import React, { useCallback, useState } from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NavigationDrawer from './NavigationDrawer';

const NavigationDrawerButton = () => {
  const [isOpen, setOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const openDrawer = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <>
      <IconButton onClick={openDrawer} color="inherit" size="large">
        <MenuIcon />
      </IconButton>
      <NavigationDrawer isOpen={isOpen} close={closeDrawer} />
    </>
  );
};

export default NavigationDrawerButton;
