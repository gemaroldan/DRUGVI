import React from 'react';
import Box from '@mui/material/Box';

export default function LogoIcon() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        width: '3.5rem',
        paddingRight: '5px',
      }}
      component="img"
      src="/drugvi.png"
      alt="Visualizer for Drug discovery and Repositioning"
      title="Visualizer for Drug discovery and Repositioning"
    />
  );
}
