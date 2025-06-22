import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

interface ResizableSidebarLayoutProps {
  sidebarContent: ReactNode;
  mainContent: ReactNode;
  initialSidebarWidth?: number;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
}

const ResizableSidebarLayout: React.FC<ResizableSidebarLayoutProps> = ({
  sidebarContent,
  mainContent,
  initialSidebarWidth = 250,
  minSidebarWidth = 150,
  maxSidebarWidth = 500,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(initialSidebarWidth);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const theme = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current && sidebarRef.current) {
        const sidebarLeft = sidebarRef.current.getBoundingClientRect().left;
        const newWidth = Math.min(
          Math.max(e.clientX - sidebarLeft, minSidebarWidth),
          maxSidebarWidth,
        );
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minSidebarWidth, maxSidebarWidth]);

  const startResizing = () => {
    isResizing.current = true;
    setIsDragging(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '90vh', overflow: 'hidden' }}>
      {sidebarVisible && (
        <Box
          ref={sidebarRef}
          sx={{
            width: sidebarWidth,
            minWidth: '250px',
            bgcolor: 'background.paper',
            overflowY: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderRight: '1px solid #ccc',
            transition: isDragging ? 'none' : 'width 0.2s',

            backgroundColor: theme.palette.background.default,
          }}
        >
          {/* Header del Sidebar con botón para ocultar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -4 }}>
            <IconButton
              size="small"
              onClick={() => setSidebarVisible(false)}
              title="Hide sidebar"
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Contenido del sidebar */}
          <Box sx={{ flexGrow: 1 }}>{sidebarContent}</Box>

          {/* Handler visual para resize */}
          <Box
            title="Click and drag the line to resize. Drog to finish."
            onMouseDown={startResizing}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 12,
              height: '100%',
              cursor: 'col-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              '&:hover .resize-lines': {
                bgcolor: '#666',
              },
            }}
          >
            <Box
              className="resize-lines"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'center',
              }}
            ></Box>
            <Box sx={{ width: 2, height: 10, bgcolor: '#999' }} />
            <Box sx={{ width: 2, height: 10, bgcolor: '#999' }} />
            <Box sx={{ width: 2, height: 10, bgcolor: '#999' }} />
          </Box>
        </Box>
      )}

      {/* Área principal */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
        {!sidebarVisible && (
          <IconButton
            onClick={() => setSidebarVisible(true)}
            title="Show sidebar"
          >
            <MenuIcon />
          </IconButton>
        )}
        {mainContent}
      </Box>
    </Box>
  );
};

export default ResizableSidebarLayout;
