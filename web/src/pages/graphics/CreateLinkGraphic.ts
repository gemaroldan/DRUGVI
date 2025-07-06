import * as d3 from 'd3';
import Node from '../../types/graphic/Node';
import Relationship from '../../types/graphic/Link';
import { showTooltip, moveTooltip, hideTooltip } from './TooltipNode';
import {
  getLocation,
  calculateSize,
  getShape,
  X,
  Y,
  getNodeId,
  ShapeType,
} from './FormatGraphic';
import SvgSize from '../../types/graphic/SvgSize';

export type createRelationshipsFn = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  linkGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  relationships: Relationship[],
  nodes: Node[],
  tooltip: HTMLDivElement | null,
  svgSize: SvgSize,
) => void;

const ACTIVATION = 'activation';
//const INHIBITION = 'inhibition';

// Calculate the connection point at the edge of the node
const calculateLinkPosition = (
  source: Node,
  target: Node,
  svgSize: SvgSize,
) => {
  let x1: number = getLocation(X, source, 'text', svgSize);
  let y1: number = getLocation(Y, source, 'text', svgSize);
  let x2: number = getLocation(X, target, 'text', svgSize);
  let y2: number = getLocation(Y, target, 'text', svgSize);

  const r = 15;

  // Calculate the connection point at the edge of the node
  if (getShape(source) === 'circle') {
    const angle = Math.atan2(y2 - y1, x2 - x1);

    //x1 = source.properties.x + source.properties.r * Math.cos(angle);
    //y1 = source.properties.y + source.properties.r * Math.sin(angle);
    x1 = x1 + r * Math.cos(angle);
    y1 = y1 + r * Math.sin(angle);
  } else if (getShape(source) === 'rect') {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const width =
      calculateSize(X, getShape(source) as ShapeType, source.properties.name) /
      2;
    const height = calculateSize(Y, getShape(source) as ShapeType) / 2;
    const scale = Math.min(Math.abs(width / dx), Math.abs(height / dy));
    x1 += dx * scale;
    y1 += dy * scale;
  }

  // Calculate point on edge for destination node
  if (getShape(target) === 'circle') {
    const angle = Math.atan2(y1 - y2, x1 - x2);
    //x2 = target.properties.x + target.properties.r * Math.cos(angle);
    //y2 = target.properties.y + target.properties.r * Math.sin(angle);
    x2 = x2 + r * Math.cos(angle);
    y2 = y2 + r * Math.sin(angle);
  } else if (getShape(target) === 'rect') {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const width =
      calculateSize(X, getShape(target) as ShapeType, target.properties.name) /
      2;
    const height = calculateSize(Y, getShape(target) as ShapeType) / 2;
    const scale = Math.min(Math.abs(width / dx), Math.abs(height / dy));
    x2 += dx * scale;
    y2 += dy * scale;
  }
  return { x1, y1, x2, y2 };
};

export const createRelationships = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  linkGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  relationships: Relationship[],
  nodes: Node[],
  tooltip: HTMLDivElement | null,
  svgSize: SvgSize,
) => {
  // Arrow
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('markerWidth', 20)
    .attr('markerHeight', 20)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
    .attr('fill', 'black');

  // Arrow - line-end
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrowline-end')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 3) // Ajusta la posición de la línea
    .attr('refY', 5)
    .attr('markerWidth', 25)
    .attr('markerHeight', 25)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M0,1 L0,9') // Línea vertical como terminación
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  const getArrow = (r: Relationship) => {
    return r.type === ACTIVATION ? 'url(#arrowhead)' : 'url(#arrowline-end)';
  };

  relationships.forEach((r) => {
    const sourceNode = nodes.find((node) => node.id === r.source.id);
    const targetNode = nodes.find((node) => node.id === r.target.id);
    if (
      sourceNode &&
      targetNode &&
      (targetNode.labels[0] === 'NPathway' ||
        targetNode.labels[0] === 'Function')
    ) {
      linkGroup
        .append('line')
        .attr(
          'id',
          'line_' + getNodeId(sourceNode) + ',' + getNodeId(targetNode),
        )
        .attr('x1', calculateLinkPosition(sourceNode, targetNode, svgSize).x1)
        .attr('y1', calculateLinkPosition(sourceNode, targetNode, svgSize).y1)
        .attr('x2', calculateLinkPosition(sourceNode, targetNode, svgSize).x2)
        .attr('y2', calculateLinkPosition(sourceNode, targetNode, svgSize).y2)
        .attr('stroke', 'grey')
        .attr('stroke-width', 0.3)
        .attr('marker-end', getArrow(r))
        .on('click', () => {
          alert(`Node clicked: ${targetNode.properties.name}`);
        })
        .on('mouseover', (event) => {
          showTooltip(tooltip, event, r);
        })
        .on('mousemove', (event) => {
          moveTooltip(tooltip, event);
        })
        .on('mouseout', () => hideTooltip(tooltip));
    }
  });
};
