import Circuit from './Circuit';
import GraphData from './graphic/GraphData';

interface DiseaseCircuit {
  name: string;
  circuits: string[] | null;
  subpathways: GraphData;
}

export default DiseaseCircuit;
