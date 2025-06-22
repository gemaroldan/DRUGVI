import PathwayCircuit from './PathwayCircuit';

interface DiseaseMap {
  id: string;
  name: string;
  description?: string;
  circuits?: PathwayCircuit;
}

export default DiseaseMap;
