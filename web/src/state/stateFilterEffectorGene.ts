import { atom } from 'recoil';
import Node from '../types/graphic/Node';

const stateFilterEffectorGene = atom({
  key: 'filter.effectorGene',
  default: null as Node | null,
});

export default stateFilterEffectorGene;
