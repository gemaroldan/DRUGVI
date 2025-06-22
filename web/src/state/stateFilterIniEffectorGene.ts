import { atom } from 'recoil';
import Node from '../types/graphic/Node';

const stateFilterIniEffectorGene = atom({
  key: 'filter.iniEffectorGene',
  default: null as Node | null,
});

export default stateFilterIniEffectorGene;
