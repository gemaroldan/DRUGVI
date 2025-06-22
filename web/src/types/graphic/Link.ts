import Node from './Node';
import * as d3 from 'd3';

interface Link extends d3.SimulationLinkDatum<Node> {
  id: string;
  source: Node;
  target: Node;
  type: string;
  properties: object;
}

export default Link;
