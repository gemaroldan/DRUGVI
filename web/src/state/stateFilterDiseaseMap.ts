import { atom } from 'recoil';
import DiseaseMap from '../types/DiseaseMap';

const stateFilterDiseaseMap = atom({
  key: 'filter.diseaseMap',
  default: null as DiseaseMap | null,
});

export default stateFilterDiseaseMap;
