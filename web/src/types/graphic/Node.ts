import * as d3 from 'd3';
import NFunction from './NFunction';
import NPathway from './NPathway';
import Gene from './Gene';
import Metabolite from './Metabolite';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  labels: string[];
  properties: NPathway | Metabolite | NFunction | Gene | any;
}

export default Node;
