import React, { useCallback } from 'react';
import { IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { MenuInfo } from './MenuInfo';

const InfoMenuAppBar = () => {
  const [anchorMenuInfo, setanchorMenuInfo] =
    React.useState<HTMLElement | null>(null);
  const isOpenMenuInfo = Boolean(anchorMenuInfo);

  const openMenuInfo = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setanchorMenuInfo(event.currentTarget);
    },
    [setanchorMenuInfo],
  );

  const closeMenuInfo = useCallback(() => {
    setanchorMenuInfo(null);
  }, [setanchorMenuInfo]);

  return (
    <div>
      <IconButton color="inherit" onClick={(e) => openMenuInfo(e)}>
        <HelpIcon />
      </IconButton>
      <MenuInfo
        anchor={anchorMenuInfo}
        isOpen={isOpenMenuInfo}
        closeMenu={closeMenuInfo}
      />
    </div>
  );
};

export default InfoMenuAppBar;
