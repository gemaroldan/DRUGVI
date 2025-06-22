export interface link {
  path: string;
  title: string;
  component?: JSX.Element;
  startIcon?: JSX.Element;
}

export interface menuItem {
  title: string;
  actionType: MenuAction;
  startIcon?: JSX.Element;
  actionValue?: string;
  modalType?: ModalType;
  subMenu?: subMenuItem[];
}
export interface subMenuItem {
  title: string;
  actionType: string;
  actionValue?: string;
}

export enum MenuAction {
  LINK = 'link',
  MODAL = 'modal',
  SUBMENU = 'subMenu',
}

export enum ModalType {
  SEND = 'send',
  CITE = 'cite',
  DATA = 'data',
}
