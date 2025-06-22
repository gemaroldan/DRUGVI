import Circuit from './Circuit';
import GraphData from './graphic/GraphData';

interface PathwayCircuit {
  pathway_id: string;
  p_patwhays: Circuit[] | null;
  subpathways: GraphData;
}

export default PathwayCircuit;
