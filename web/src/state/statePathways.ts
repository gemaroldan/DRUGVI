import { atom } from 'recoil';
import Pathway from '../types/Pathway';

const statePathways = atom({
  key: 'select.pathways',
  default: null as Pathway[] | null,
});

export default statePathways;
