import { atom } from 'recoil';
import Node from '../types/graphic/Node';

const stateEffectorGenes = atom({
  key: 'select.effectorGene',
  default: null as Node[] | null,
});

export default stateEffectorGenes;
