import { atom } from 'recoil';
import Node from '../types/graphic/Node';

const stateSelectedNode = atom({
  key: 'selected.node',
  default: null as Node | null,
});

export default stateSelectedNode;
