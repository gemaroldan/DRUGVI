import DiseaseCircuit from './DiseaseCircuit';
import PathwayCircuit from './DiseaseCircuit';

interface DiseaseMap {
  id: string;
  name: string;
  description?: string;
  diseaseCircuits?: Record<string, DiseaseCircuit> | null;
}

export default DiseaseMap;
