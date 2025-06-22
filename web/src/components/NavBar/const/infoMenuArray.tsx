import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import { MenuAction, ModalType, menuItem } from '../types/NavBarTypes';

export const infoMenuArray: menuItem[] = [
  {
    title: 'Documentation',
    startIcon: <ArticleIcon />,
    actionType: MenuAction.LINK,
    actionValue: 'https://github.com/babelomics/CSVS/wiki',
  },
  {
    title: 'Source Code',
    startIcon: <GitHubIcon />,
    actionType: MenuAction.LINK,
    actionValue: 'https://github.com/babelomics/csvs/',
  },
  {
    title: 'Send an email',
    startIcon: <EmailIcon />,
    actionType: MenuAction.MODAL,
    modalType: ModalType.SEND,
  },
  {
    title: 'How to Cite',
    startIcon: <FormatQuoteIcon />,
    actionType: MenuAction.MODAL,
    modalType: ModalType.CITE,
  },
  {
    title: 'Database version',
    startIcon: <StorageIcon />,
    actionType: MenuAction.MODAL,
    modalType: ModalType.DATA,
  },
  {
    title: 'Related tools',
    startIcon: <BuildIcon />,
    actionType: MenuAction.SUBMENU,
    subMenu: [
      {
        title: 'SPACNACS',
        actionType: MenuAction.LINK,
        actionValue: 'http://csvs.clinbioinfosspa.es/spacnacs/',
      },
    ],
  },
];
