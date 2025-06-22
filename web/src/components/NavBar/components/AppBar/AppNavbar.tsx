import React, { useEffect } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import NavigationDrawerButton from '../NavigationDrawer/NavigationDrawerButton';
import NavigationLinks from './NavigationLinks';
import InfoMenuAppBar from '../MenuInfo/InfoMenuAppBar';

// TODO: Add sx to css
export const AppNavbar: React.FC = () => {
  // TODO: Remove effect when fix the library
  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div',
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay',
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <NavigationDrawerButton />
        </Box>
        <NavigationLinks />
        <InfoMenuAppBar />
      </Toolbar>
    </AppBar>
  );
};
