import React from 'react';
import { Box, Drawer, List } from '@mui/material';
import DrawerItem from './DrawerItem';
import HomeIcon from '@mui/icons-material/Home';
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

import Config from '../../../../config/Config';

interface NavigationDrawerProps {
  isOpen: boolean;
  close: () => void;
}

const NavigationDrawer = ({ isOpen, close }: NavigationDrawerProps) => {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={close}
      sx={{ display: { xs: 'flex', sm: 'none' } }}
    >
      <Box>
        <nav>
          <List>
            <DrawerItem
              path={Config.PATH_ROUTES.HOME}
              title={Config.APP.ABR}
              description={Config.APP.TITLE}
              startIcon={<HomeIcon />}
              close={close}
            />
            <DrawerItem
              path={Config.PATH_ROUTES.PATHWAY}
              title="Pathways"
              startIcon={<RouteIcon />}
              close={close}
            />
            <DrawerItem
              path={Config.PATH_ROUTES.DISEASE_MAP}
              title="Diseases map"
              startIcon={<MapIcon />}
              close={close}
            />
            <DrawerItem
              path={Config.PATH_ROUTES.PRIVACY}
              title="Privacy and data protection"
              description="Privacy and data protection"
              startIcon={<PrivacyTipIcon />}
              close={close}
            />

            <DrawerItem
              path={Config.PATH_ROUTES.ABOUT}
              title="About"
              startIcon={<InfoIcon />}
              close={close}
            />
          </List>
        </nav>
      </Box>
    </Drawer>
  );
};

export default NavigationDrawer;
