import CircuitProperties from './CircuitProperties';
//import GraphData from './graphic/GraphData';

interface Circuit {
  id: string;
  name?: string;
  labels?: string[];
  description?: string;
  properties?: CircuitProperties;
  //subpathways: GraphData;
}

export default Circuit;
