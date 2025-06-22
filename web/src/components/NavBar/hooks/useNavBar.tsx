/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { MenuAction, ModalType, menuItem } from '../types/NavBarTypes';

export const useNavBar = (): {
  anchorMenuEl: HTMLElement | null;
  subMenuAnchorEl: HTMLElement | null;
  subMenuIndex: number | null;
  openCiteModal: boolean;
  openDataBaseModal: boolean;
  openSendMailModal: boolean;
  openEmailModal: boolean;
  handleCloseMenu: () => void;
  handleCloseSubMenu: () => void;
  handleMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuItemClick: (
    event: React.MouseEvent<HTMLElement>,
    menuItem: menuItem,
    index: number,
  ) => void;
  handleOpenModal: (modalType: ModalType) => void;
  handleCloseModal: () => void;
} => {
  const [anchorMenuEl, setAnchorMenuEl] = useState<null | HTMLElement>(null);
  const [subMenuAnchorEl, setsubMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [subMenuIndex, setsubMenuIndex] = useState<number | null>(null);
  const [openSendMailModal, setopenSendMailModal] = useState(false);
  const [openCiteModal, setopenModalCite] = useState(false);
  const [openDataBaseModal, setopenDataBaseModal] = useState(false);
  const [openEmailModal, setopenEmailModal] = useState(false);

  const modalStateMap = {
    [ModalType.SEND]: {
      open: openSendMailModal,
      setOpen: setopenSendMailModal,
    },
    [ModalType.CITE]: { open: openCiteModal, setOpen: setopenModalCite },
    [ModalType.DATA]: {
      open: openDataBaseModal,
      setOpen: setopenDataBaseModal,
    },
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenuEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };
  const handleSubMenu = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setsubMenuAnchorEl(event.currentTarget);
    setsubMenuIndex(index);
  };
  const handleCloseSubMenu = () => {
    setsubMenuIndex(null);
    setsubMenuAnchorEl(null);
  };

  const handleOpenModal = (modalType: ModalType) => {
    const { setOpen } = modalStateMap[modalType];
    setOpen(true);
  };

  const handleCloseModal = () => {
    setopenDataBaseModal(false);
    setopenModalCite(false);
    setopenSendMailModal(false);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    menuItem: menuItem,
    index: number,
  ) => {
    const { actionType, modalType, actionValue } = menuItem;

    switch (actionType) {
      case MenuAction.LINK:
        handleCloseMenu();
        handleCloseSubMenu();
        window.open(actionValue, '_blank');
        break;

      case MenuAction.MODAL:
        switch (modalType) {
          case ModalType.SEND:
            handleOpenModal(modalType);
            break;

          case ModalType.CITE:
            handleOpenModal(modalType);
            break;

          case ModalType.DATA:
            handleOpenModal(modalType);
            break;
        }
        break;

      case MenuAction.SUBMENU:
        handleSubMenu(event, index);
        break;

      default:
        handleCloseMenu();
        break;
    }
  };

  return {
    anchorMenuEl,
    subMenuAnchorEl,
    subMenuIndex,
    openCiteModal,
    openDataBaseModal,
    openSendMailModal,
    openEmailModal,
    handleCloseMenu,
    handleCloseSubMenu,
    handleMenu,
    handleMenuItemClick,
    handleOpenModal,
    handleCloseModal,
  };
};
