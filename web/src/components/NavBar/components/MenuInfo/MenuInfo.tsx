import React, { useCallback, useState } from 'react';
import { Box, Link, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { CiteModal } from './CiteModal';
import { DatabaseModal } from './DatabaseModal';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import Config from '../../../../config/Config';

interface Props {
  anchor: HTMLElement | null;
  isOpen: boolean;
  closeMenu: () => void;
}
const iconMap = {
  documentation: <ArticleIcon />,
  github: <GitHubIcon />,
  email: <EmailIcon />,
  cite: <FormatQuoteIcon />,
  database: <StorageIcon />,
  tools: <BuildIcon />,
};

export const MenuInfo: React.FC<Props> = ({ anchor, isOpen, closeMenu }) => {
  const [currentModal, setCurrentModal] = useState<null | 'db' | 'cite'>(null);

  const openModal = useCallback((modalName: 'db' | 'cite') => {
    setCurrentModal(modalName);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const menuItemsData = [
    {
      text: 'Documentation',
      icon: iconMap.documentation,
      link: Config.APP.DOCUMENTATION,
    },
    {
      text: 'Source Code',
      icon: iconMap.github,
      link: Config.APP.SOURCE,
    },
    {
      text: 'How to Cite',
      icon: iconMap.cite,
      action: () => openModal('cite'),
    },
    /* {
      text: 'Database Version',
      icon: iconMap.documentation,
      action: () => openModal('db'),
    },*/
  ];

  return (
    <>
      <Menu
        id="menu-appbar"
        open={isOpen}
        anchorEl={anchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={closeMenu}
      >
        {menuItemsData.map((item) => {
          const { text, icon, action, link } = item;

          return (
            <MenuItem
              key={text}
              onClick={action ? action : closeMenu}
              component={link ? 'a' : 'div'}
              href={link}
              target="_blank"
            >
              <ListItemIcon sx={{ marginRight: '10px' }}>{icon}</ListItemIcon>
              {text}
            </MenuItem>
          );
        })}

        <Box display="flex" justifyContent="flex-end" pr={2}>
          <Link
            component="button"
            variant="body2"
            onClick={closeMenu}
            underline="hover"
            sx={{
              color: 'primary.main',
              fontWeight: 'medium',
              textTransform: 'uppercase',
            }}
          >
            Close
          </Link>
        </Box>
      </Menu>

      {currentModal === 'cite' ? (
        <CiteModal open={Boolean(currentModal)} closeModal={closeModal} />
      ) : null}
      {currentModal === 'db' ? (
        <DatabaseModal open={Boolean(currentModal)} closeModal={closeModal} />
      ) : null}
    </>
  );
};
