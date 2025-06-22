import { atom } from 'recoil';
import Pathway from '../types/Pathway';

const stateFilterPathway = atom({
  key: 'filter.pathway',
  default: null as Pathway | null,
});

export default stateFilterPathway;
