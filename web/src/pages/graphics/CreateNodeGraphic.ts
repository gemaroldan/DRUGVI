import * as d3 from 'd3';
import { graphMoving, graphSelected } from '../../theme';
import Node from '../../types/graphic/Node';
import { showTooltip, moveTooltip, hideTooltip } from './TooltipNode';
import {
  getShape,
  getLocation,
  calculateSize,
  X,
  Y,
  MOV_LABEL_METABOLITE,
  getNodeRadius,
  getNodeColor,
  getNodeId,
} from './FormatGraphic';
import SvgSize from '../../types/graphic/SvgSize';

export type CreateNodesFn = (
  nodeGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  tooltip: HTMLDivElement | null,
  svgSize: SvgSize,
  setSelectedNode: (node: Node) => void,
) => void;

export type CreateLabelsNodesFn = (
  nodeGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  svgSize: SvgSize,
  tooltip: HTMLDivElement | null,
  setSelectedNode: (node: Node) => void,
) => void;

export const typeNode = {
  NPATHWAY: 'NPathway',
  METABOLITE: 'Metabolite',
  GENE: 'Gene',
  FUNCTION: 'Function',
  DRUG: 'Drug',
};
export type D3Event<T extends Event, E extends Element> = T & {
  currentTarget: E;
};

export const createNodes = (
  nodeGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  tooltip: HTMLDivElement | null,
  svgSize: SvgSize,
  setSelectedNode: (node: Node) => void,
) => {
  nodes.forEach((node, i) => {
    const shape = getShape(node);
    const nodeId = getNodeId(node);

    // Crear diferentes formas según el tipo
    if (shape === 'circle') {
      nodeGroup
        .append('circle')
        .attr('id', nodeId)
        .attr('r', getNodeRadius(node.labels[0])) // Usar la función para definir el radio
        .attr('fill', getNodeColor(node)) // Usar la función para definir el color
        .attr('cursor', 'pointer')
        .attr('stroke', 'grey')
        .attr('stroke-width', 2)
        .on('click', (event) => clickHander(event, node, setSelectedNode))
        .on('mouseover', (event) => {
          showTooltip(tooltip, event, node);
        })
        .on('mousemove', (event) => {
          moveTooltip(tooltip, event);
        })
        .on('mouseout', () => hideTooltip(tooltip))
        //.call(dragHandler);
        .call(
          dragHandler as unknown as (
            selection: d3.Selection<SVGCircleElement, unknown, null, undefined>,
          ) => void,
        );

      if (X in node.properties) {
        nodeGroup
          .select('#' + nodeId)
          .attr('cx', getLocation(X, node, shape, svgSize)) // Posicionamiento de nodos
          .attr('cy', getLocation(Y, node, shape, svgSize)); // Posición fija en y
      }
    } else if (shape === 'rect') {
      nodeGroup
        .append('rect')
        .attr('id', nodeId)
        .attr('x', getLocation(X, node, shape, svgSize)) // Centrando el cuadrado
        .attr('y', getLocation(Y, node, shape, svgSize)) // Centrando el cuadrado
        .attr('width', calculateSize(X, shape, node.properties.name)) // Usar el radio para ancho
        .attr('height', calculateSize(Y, shape)) // Usar el radio para alto
        .attr('fill', getNodeColor(node))
        .attr('cursor', 'pointer')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('click', (event) => {
          //selectedNode(node);
          clickHander(event, node, setSelectedNode);
        })
        .on('mouseover', (event) => {
          showTooltip(tooltip, event, node);
        })
        .on('mousemove', (event) => {
          moveTooltip(tooltip, event);
        })
        .on('mouseout', () => hideTooltip(tooltip))
        //       .call(dragHandler as any);
        .call(
          dragHandler as unknown as (
            selection: d3.Selection<SVGRectElement, unknown, null, undefined>,
          ) => void,
        );
    } else if (shape === 'triangle') {
      const size = getNodeRadius(node.labels[0]); // Tamaño para el triángulo
      const points = `${(i + 1) * 100},${300 - size} ${(i + 1) * 100 - size},${300 + size} ${(i + 1) * 100 + size},${300 + size}`;

      nodeGroup
        .append('polygon')
        .attr('id', nodeId)
        .attr('points', points)
        .attr('fill', getNodeColor(node))
        .attr('cursor', 'pointer')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('click', (event) => {
          if (event.defaultPrevented) return;
          alert(`Node clicked: ${node.properties.name}`);
        })
        .on('mouseover', (event) => {
          showTooltip(tooltip, event, node);
        })
        .on('mousemove', (event) => {
          moveTooltip(tooltip, event);
        })
        .on('mouseout', () => hideTooltip(tooltip))
        //.call(dragHandler as any);
        .call(
          dragHandler as unknown as (
            selection: d3.Selection<
              SVGPolygonElement,
              unknown,
              null,
              undefined
            >,
          ) => void,
        );
    }
  });
};

const isMetabolite = (node: Node) => {
  return (
    node.labels[0] == typeNode.NPATHWAY &&
    'properties' in node &&
    'shape' in node.properties &&
    node.properties.shape == typeNode.METABOLITE.toLocaleLowerCase()
  );
};

export const createLabelsNodes = (
  nodeGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  svgSize: SvgSize,
  tooltip: HTMLDivElement | null,
  setSelectedNode: (node: Node) => void,
) => {
  // Añadir etiquetas a los nodos
  nodeGroup
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .raise()
    .attr('cursor', 'pointer')
    .attr('id', (n) => 'text_' + getNodeId(n))
    .attr('x', (n) => getLocation(X, n, 'text', svgSize))
    .attr(
      'y',
      (n) =>
        getLocation(Y, n, 'text', svgSize) -
        (isMetabolite(n) ? MOV_LABEL_METABOLITE : 0),
    )
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', '16px')
    .text((d) => d.properties.name)
    .attr('font-size', '12px')
    .attr('fill', 'black')
    .on('click', (_, d) => clickHanderLabel(d, setSelectedNode))
    .on('mouseover', (event, d) => {
      showTooltip(tooltip, event, d);
    })
    .on('mousemove', (event) => {
      moveTooltip(tooltip, event);
    })
    .on('mouseout', () => hideTooltip(tooltip));
};

let activeDrag: SVGRectElement | SVGCircleElement | null = null;
let colorBeforeDragHandler: string = '';

const dragHandler = d3
  .drag<SVGRectElement | SVGCircleElement, unknown>()
  .on(
    'start',
    function (_event: d3.D3DragEvent<SVGRectElement, unknown, unknown>) {
      if (!activeDrag) {
        //const nodeId = this.id.replace('text_', '');
        const defaultColor =
          this.style.fill == null ? 'green' : this.style.fill;
        colorBeforeDragHandler =
          this.tagName === 'rect' && this.getAttribute('fill')
            ? this.getAttribute('fill')!
            : defaultColor;

        //console.log('Init drag:', this.tagName, nodeId);
        //console.log(this);
        activeDrag =
          this.tagName == 'circle'
            ? (this as SVGCircleElement)
            : (this as SVGRectElement); // Set active
        if (this.tagName == 'circle') {
          d3.select<SVGRectElement | SVGCircleElement, unknown>(this).style(
            'fill',
            graphMoving,
          );
        } else {
          d3.select<SVGRectElement | SVGCircleElement, unknown>(this).attr(
            'fill',
            graphMoving,
          );
        }
      }
    },
  )
  .on(
    'drag',
    function (
      event: d3.D3DragEvent<
        SVGRectElement | SVGCircleElement,
        unknown,
        unknown
      >,
    ) {
      if (activeDrag === this) {
        const nodeId = this.id;
        const tagName = this.tagName;
        console.log('Drag:', this.id, this.tagName);
        const borderWidth =
          this.getAttribute('width') != null
            ? parseInt(this.getAttribute('width') || '0') / 2
            : 0;
        const borderHeight =
          this.getAttribute('height') != null
            ? parseInt(this.getAttribute('height') || '0') / 2
            : 0;
        const radio =
          this != null && this.getAttribute('r') != null
            ? parseInt(this.getAttribute('r') || '0')
            : 0;

        if (tagName == 'rect') {
          d3.select<SVGRectElement | SVGCircleElement, unknown>(this)
            .attr('x', event.x - borderWidth)
            .attr('y', event.y - borderHeight);
        } else {
          d3.select<SVGRectElement | SVGCircleElement, unknown>(this)
            .attr('cx', event.x)
            .attr('cy', event.y);
        }

        // Move text
        const textSelected = selectTextByNode(nodeId);
        textSelected.each(function (this: SVGTextElement) {
          const isMetabolite =
            nodeId.startsWith('NPathway') && tagName == 'circle';
          d3.select(this)
            .raise()
            .attr('x', event.x + (isMetabolite ? 0 : 0))
            .attr('y', event.y + (isMetabolite ? -MOV_LABEL_METABOLITE : 0));
        });

        // Move links
        const linksStart = selectStartLiksByNode(nodeId);
        linksStart.each(function (this: SVGLineElement) {
          if (tagName == 'rect') {
            d3.select(this)
              .attr('x1', event.x + borderWidth)
              .attr('y1', event.y);
          } else {
            d3.select(this)
              .attr('x1', event.x + radio)
              .attr('y1', event.y);
          }
        });

        const linksEnd = selectEndLiksByNode(nodeId);
        linksEnd.each(function (this: SVGLineElement) {
          if (tagName == 'rect') {
            d3.select(this)
              .attr('x2', event.x - borderWidth)
              .attr('y2', event.y);
          } else {
            d3.select(this)
              .attr('x2', event.x + radio)
              .attr('y2', event.y);
          }
        });
      }
    },
  )
  .on(
    'end',
    function (
      _event: d3.D3DragEvent<
        SVGRectElement | SVGCircleElement,
        unknown,
        unknown
      >,
    ) {
      if (activeDrag === this) {
        //console.log('Finalizando el arrastre de:', this.id, this.tagName);
        activeDrag = null; // Liberar el rectángulo activo
        if (this.tagName == 'circle') {
          d3.select<SVGRectElement | SVGCircleElement, unknown>(this).style(
            'fill',
            colorBeforeDragHandler,
          );
        } else {
          d3.select<SVGRectElement | SVGCircleElement, unknown>(this).attr(
            'fill',
            //'lightblue',
            colorBeforeDragHandler,
          );
        }
      }
    },
  );

function selectTextByNode(nodoId: string) {
  const selector = `text[id="text_${nodoId}"]`;
  return d3.selectAll<SVGTextElement, unknown>(selector);
}

function selectStartLiksByNode(nodoId: string) {
  const selector = `line[id^="line_${nodoId},"]`;
  return d3.selectAll<SVGLineElement, unknown>(selector);
}

function selectEndLiksByNode(nodoId: string) {
  const selector = `line[id$=",${nodoId}"]`;
  return d3.selectAll<SVGLineElement, unknown>(selector);
}

const clickHanderLabel = (
  data: Node,
  setSelectedNode: (node: Node) => void,
) => {
  setSelectedNode(data);
};

const clickHander = (
  event: D3Event<MouseEvent, SVGGElement>,
  node: Node,
  setSelectedNode: (node: Node) => void,
) => {
  if (event.defaultPrevented) return;
  setSelectedNode(node);
};

export const highlightNodes = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodes: Node[],
) => {
  clearHighlightNodes(svg);
  nodes.forEach((n) => {
    if (n.properties?.shape == 'metabolite') {
      const searchNodeMet = svg.select('circle#' + getNodeId(n));
      searchNodeMet.style('fill', 'orange');
    } else {
      const searchNode = svg.select('rect#' + getNodeId(n));
      if (searchNode != null) {
        searchNode.attr('fill', 'orange');
      }
    }
  });
};

export const clearHighlightNodes = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
) => {
  const selector = `rect[id^="NPathway_N"]`;
  svg.selectAll(selector).attr('fill', 'lightblue');

  const selectorMet = `circle[id^="NPathway_N"]`;
  svg.selectAll(selectorMet).style('fill', '');
};

export const setSelectNodeColor = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  node: Node,
) => {
  clearSelectNodeColor(svg);
  if (node.properties?.shape == 'metabolite') {
    const searchNodeMet = svg.select('circle#' + getNodeId(node));
    searchNodeMet.attr('stroke', graphSelected).attr('stroke-width', 5);
  } else {
    const searchNode = svg.select('rect#' + getNodeId(node));
    if (searchNode != null) {
      searchNode.attr('stroke', graphSelected).attr('stroke-width', 5);
    }
  }
};

export const clearSelectNodeColor = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
) => {
  const selector = `rect[stroke="${graphSelected}"]`;
  svg.selectAll(selector).attr('stroke', 'white').attr('stroke-width', 2);

  const selectorMet = `circle[stroke="${graphSelected}"]`;
  svg.selectAll(selectorMet).attr('stroke', 'grey').attr('stroke-width', 2);
};
