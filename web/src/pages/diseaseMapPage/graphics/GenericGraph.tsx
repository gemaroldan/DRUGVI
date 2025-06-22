// GenericGraph.tsx
import { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useSetRecoilState } from 'recoil';
import stateSelectedNode from '../../../state/stateSelectedNode';
import { useGraphData } from './useGraphData';
import GraphData from '../../../types/graphic/GraphData';
import SvgSize from '../../../types/graphic/SvgSize';
import { createLabelsNodes } from '../../graphics/CreateNodeGraphic';

const WIDTH = 'WIDTH';
const HEIGHT = 'HEIGHT';

type GenericGraphProps = {
  graphKey: string;
  graph: GraphData;
  createNodes: Function;
  createLabelsNodes: Function | undefined;
  createLinks: Function;
};

function getSizeSvg(typeSize: string, svgSize: SvgSize): number {
  return typeSize === WIDTH
    ? svgSize.maxW - svgSize.minW + 2 * svgSize.marginW
    : svgSize.maxH - svgSize.minH + 2 * svgSize.marginH;
}

function renderGraph(
  svgRef: React.RefObject<SVGSVGElement>,
  graph: GraphData,
  svgSize: SvgSize,
  createNodes: Function,
  createLabelsNodes: Function,
  createLinks: Function,
  tooltip: HTMLDivElement | null,
  handleSelectedNode: (node: any) => void,
) {
  useEffect(() => {
    if (graph.nodes.length > 0 && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const nodeGroup = svg.append('g').attr('class', 'nodes');
      const linkGroup = svg.append('g').attr('class', 'links');

      createNodes(nodeGroup, graph.nodes, tooltip, svgSize, handleSelectedNode);
      createLabelsNodes(nodeGroup, graph.nodes, svgSize);
      createLinks(svg, linkGroup, graph.links, graph.nodes, tooltip, svgSize);
    }
  }, [graph, svgSize]);
}

function GenericGraph({
  graphKey,
  graph,
  createNodes,
  createLinks,
}: GenericGraphProps) {
  const setSelectedNode = useSetRecoilState(stateSelectedNode);
  //const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltip = tooltipRef.current;
  const [svgSize, setSvgSize] = useState<SvgSize>({
    minW: 100,
    maxW: 100,
    minH: 100,
    maxH: 100,
    marginW: 50,
    marginH: 50,
  });

  function handleSelectedNode(node: any) {
    setSelectedNode(node);
  }

  useGraphData(graph, setSvgSize);
  renderGraph(
    svgRef,
    graph,
    svgSize,
    createNodes,
    createLabelsNodes,
    createLinks,
    tooltip,
    handleSelectedNode,
  );

  return (
    <div className={`GraphContainer{key}`}>
      <svg
        ref={svgRef}
        width={getSizeSvg(WIDTH, svgSize)}
        height={getSizeSvg(HEIGHT, svgSize)}
        style={{ border: '1px solid #e0e0e0' }}
      >
        {' '}
      </svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
          padding: '5px',
          display: 'none',
          pointerEvents: 'none',
        }}
      >
        {' '}
      </div>
    </div>
  );
}

export default GenericGraph;
