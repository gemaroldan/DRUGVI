import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import GraphData from '../../types/graphic/GraphData';
import WebClient from '../../client/WebClient';
import {
  createNodes,
  createLabelsNodes,
  highlightNodes,
  clearHighlightNodes,
  setSelectNodeColor,
  clearSelectNodeColor,
} from './CreateNodeGraphic';

import { createRelationships } from './CreateLinkGraphic';

import Node from '../../types/graphic/Node';

import { useRecoilState, useRecoilValue } from 'recoil';
import stateFilterPathway from '../../state/stateFilterPathway';
import stateFilterEffectorGene from '../../state/stateFilterEffectorGene';
import stateFilterIniEffectorGene from '../../state/stateFilterIniEffectorGene';
import SvgSize from '../../types/graphic/SvgSize';
import stateSelectedNode from '../../state/stateSelectedNode';
import Alert from '@mui/material/Alert/Alert';

const WIDTH = 'WIDTH';
const HEIGHT = 'HEIGHT';

function Graphic() {
  const filterPathway = useRecoilValue(stateFilterPathway);
  const filterEffectorGene = useRecoilValue(stateFilterEffectorGene);
  const filterIniEffectorGene = useRecoilValue(stateFilterIniEffectorGene);
  const [selectedNode, setSelectedNode] = useRecoilState(stateSelectedNode);

  const [graph, setGraph] = useState<GraphData>({
    nodes: [],
    links: [],
  });
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

  function getSizeSvg(typeSize: string): number {
    let result = 0;

    if (typeSize == WIDTH) {
      result = svgSize.maxW - svgSize.minW + 2 * svgSize.marginW;
    }
    if (typeSize == HEIGHT) {
      result = svgSize.maxH - svgSize.minH + 2 * svgSize.marginH;
    }
    return result;
  }

  function getMaxValues(nodes: Node[]): SvgSize {
    const result: SvgSize = {
      minW: 100,
      maxW: 0,
      minH: 100,
      maxH: 0,
      marginW: 10,
      marginH: 10,
    };

    if (nodes.length > 0) {
      nodes.map((n) => {
        result.maxW = Math.max(
          result.maxW,
          'x' in n.properties ? n.properties.x : 0,
        );
        result.maxH = Math.max(
          result.maxH,
          'y' in n.properties ? n.properties.y : 0,
        );
        result.minW = Math.min(
          result.minW,
          'x' in n.properties ? n.properties.x : 100,
        );
        result.minH = Math.min(
          result.minH,
          'y' in n.properties ? n.properties.y : 100,
        );
      });
      result.marginW = result.minW;
      result.marginH = result.minW;
    }
    return result;
  }

  function handlerSelectedNode(node: Node) {
    setSelectedNode(node);
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (selectedNode == null) {
      clearSelectNodeColor(svg);
    } else {
      setSelectNodeColor(svg, selectedNode);
    }
  }, [selectedNode]);

  /* Highlight the nodes and links */
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const svg = d3.select(svgRef.current);
        if (filterEffectorGene != null) {
          const pathwayEffectorGene = await WebClient.getPathwayEffectorGene(
            filterEffectorGene.properties.id,
            abortController.signal,
          );
          highlightNodes(svg, pathwayEffectorGene);
        } else {
          clearHighlightNodes(svg);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log('ERROR: ' + error);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [filterEffectorGene]);

  /* Highlight the nodes and links -> IniEffectorGene */
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const svg = d3.select(svgRef.current);
        clearHighlightNodes(svg);
        if (filterEffectorGene != null && filterIniEffectorGene != null) {
          const pathwayIniEffectorGene =
            await WebClient.getPathwayIniEffectorGene(
              filterIniEffectorGene.properties.id,
              filterEffectorGene.properties.id,
              abortController.signal,
            );
          highlightNodes(svg, pathwayIniEffectorGene);
        } else {
          if (filterEffectorGene != null) {
            const pathwayEffectorGene = await WebClient.getPathwayEffectorGene(
              filterEffectorGene.properties.id,
              abortController.signal,
            );
            highlightNodes(svg, pathwayEffectorGene);
          } else {
            clearHighlightNodes(svg);
          }
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log('ERROR: ' + error);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [filterIniEffectorGene]);

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        if (filterPathway != null) {
          const graphData = await WebClient.getGraphData(
            filterPathway?.id,
            abortController.signal,
          );
          console.log('Data fetched successfully:', graphData);
          const svgSize = getMaxValues(graphData.nodes);
          console.log(svgSize);
          setSvgSize(svgSize);
          setGraph(graphData);
        } else {
          // Clear
          setGraph({
            nodes: [],
            links: [],
          });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log('ERROR: ' + error);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [filterPathway]);

  useEffect(() => {
    if (graph != null && graph.nodes.length > 0 && svgRef.current) {
      const svg = d3.select(svgRef.current);
      // Clear SVG
      svg.selectAll('*').remove();

      if (graph.nodes.length > 0) {
        // Group nodes and link
        const nodeGroup = svg.append('g').attr('class', 'nodes');
        const linkGroup = svg.append('g').attr('class', 'links');
        console.log(nodeGroup);
        console.log(linkGroup);

        createNodes(
          nodeGroup,
          graph.nodes,
          tooltip,
          svgSize,
          handlerSelectedNode,
        );
        createLabelsNodes(
          nodeGroup,
          graph.nodes,
          svgSize,
          tooltip,
          handlerSelectedNode,
        );
        createRelationships(
          svg,
          linkGroup,
          graph.links,
          graph.nodes,
          tooltip,
          svgSize,
        );
      } else {
        svg
          .append('text')
          .attr('x', (svgSize.maxW - svgSize.minW) / 2)
          .attr('y', (svgSize.maxH - svgSize.minH) / 2)
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .text('No data');
      }
    } else {
      const svg = d3.select(svgRef.current);
      // Clear SVG
      svg.selectAll('*').remove();
    }
  }, [
    graph,
    svgSize,
    svgSize.maxH,
    svgSize.maxW,
    svgSize.minH,
    svgSize.minW,
    tooltip,
  ]);

  return (
    <>
      {graph.nodes.length == 0 && (
        <Alert severity="warning">Select a pathway to show graph.</Alert>
      )}
      {graph.nodes.length > 0 && (
        <div className="App">
          <svg
            ref={svgRef}
            width={getSizeSvg(WIDTH)}
            height={getSizeSvg(HEIGHT)}
            //   style={{ border: '1px solid #e0e0e0' }}
          ></svg>
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              padding: '5px',
              display: 'none',
              pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
            }}
          ></div>
        </div>
      )}
    </>
  );
}

export default Graphic;
