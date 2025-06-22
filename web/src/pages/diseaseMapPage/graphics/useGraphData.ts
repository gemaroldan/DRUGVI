// useGraphData.tsx
import { useEffect } from 'react';
import GraphData from '../../../types/graphic/GraphData';
import SvgSize from '../../../types/graphic/SvgSize';
import Node from '../../../types/graphic/Node';

export function useGraphData(
  //fetchData: (filters: any, signal: AbortSignal) => Promise<GraphData>,
  graph: GraphData,
  //filters: any,
  setSvgSize: (size: SvgSize) => void,
  //setGraph: (graph: GraphData) => void,
) {
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        // const graphData = await fetchData(filters, abortController.signal);
        setSvgSize(getMaxValues(graph.nodes));
        // setGraph(graph);
      } catch (error) {
        if (!abortController.signal.aborted) console.error(error);
      }
    })();
    return () => abortController.abort();
  }, [graph]);
}

export function getMaxValues(nodes: Node[]): SvgSize {
  return nodes.reduce(
    (acc, n) => {
      acc.maxW = Math.max(acc.maxW, n.properties?.x || 0);
      acc.maxH = Math.max(acc.maxH, n.properties?.y || 0);
      acc.minW = Math.min(acc.minW, n.properties?.x || 100);
      acc.minH = Math.min(acc.minH, n.properties?.y || 100);
      return acc;
    },
    { minW: 100, maxW: 0, minH: 100, maxH: 0, marginW: 10, marginH: 10 },
  );
}
