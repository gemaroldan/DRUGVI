import React from 'react';
import { Box } from '@mui/material';
import AppBarItem from './AppBarItem';
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

import LogoIcon from './icons/LogoIcon';
import AppBarItemLogo from './AppBarItemLogo';
import Config from '../../../../config/Config';

const NavigationLinks: React.FC = () => {
  return (
    <Box sx={{ flexWrap: 'nowrap', flexGrow: 1 }}>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <AppBarItemLogo
          path={Config.PATH_ROUTES.HOME}
          title={Config.APP.ABR}
          description={Config.APP.TITLE}
          startIcon={<LogoIcon />}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block', flexWrap: 'nowrap' } }}>
        <AppBarItemLogo
          path={Config.PATH_ROUTES.HOME}
          title={Config.APP.TITLE}
          description={Config.APP.TITLE}
          startIcon={<LogoIcon />}
        />
        <AppBarItem
          path={Config.PATH_ROUTES.PATHWAY}
          title="Pathways"
          description="Pathways"
          startIcon={<RouteIcon />}
        />
        <AppBarItem
          path={Config.PATH_ROUTES.DISEASE_MAP}
          title="Disease map"
          description="Disease map"
          startIcon={<MapIcon />}
        />
        <AppBarItem
          path={Config.PATH_ROUTES.PRIVACY}
          title="Privacy and data protection"
          description="Privacy and data protection"
          startIcon={<PrivacyTipIcon />}
        />
        <AppBarItem
          path={Config.PATH_ROUTES.ABOUT}
          title="About"
          description="About"
          startIcon={<InfoIcon />}
        />
      </Box>
    </Box>
  );
};

export default NavigationLinks;
