import Node from '../../types/graphic/Node';
import SvgSize from '../../types/graphic/SvgSize';

import { typeNode } from './CreateNodeGraphic';

export const X = 'x';
export const Y = 'y';

export const MOV_LABEL_METABOLITE = 25;

const MIN_SIZE: any = {
  rect: {
    x: 45,
    y: 25,
  },
  circle: {
    X: 15,
    y: 15,
  },
};

export const calculateSize = (
  loc: string,
  shape: string,
  name: string = '',
): number => {
  return Math.max(MIN_SIZE[shape][loc], name.length * 8);
};

export const getLocation = (
  loc: string,
  node: Node,
  shape: string,
  svgSize: SvgSize,
): number => {
  if (
    node != undefined &&
    node.properties != undefined &&
    node.properties[loc] != undefined
  ) {
    return getNewLocation(
      loc,
      shape,
      node.properties.x,
      node.properties.y,
      node.properties.name,
      svgSize,
    );
  } else {
    return 50;
  }
};

export const getNewLocation = (
  loc: string,
  shape: string,
  newX: number,
  newY: number,
  label: string,
  svgSize: SvgSize,
): number => {
  const height = svgSize.maxH - svgSize.minH + svgSize.marginH;
  switch (shape) {
    case 'rect':
      return loc == X
        ? newX - calculateSize(X, shape, label) / 2
        : height - newY - calculateSize(Y, shape) / 2;

    default:
      return loc == X ? newX : height - newY;
  }
};

export const getShape = (node: Node): string => {
  let keyShape = node.labels[0];
  if ('properties' in node && 'shape' in node.properties) {
    keyShape =
      node.properties.shape.charAt(0).toUpperCase() +
      node.properties.shape.slice(1);
  }
  switch (keyShape) {
    case typeNode.NPATHWAY:
      return 'rect';
    case typeNode.METABOLITE:
      return 'circle';
    case typeNode.GENE:
      return 'circle';
    case typeNode.FUNCTION:
      return 'square';
    default:
      return 'triangle';
  }
};

// Función para definir el radio de los nodos según el tipo
export const getNodeRadius = (tyNode: string): number => {
  switch (tyNode) {
    case typeNode.METABOLITE:
      return 20;
    case typeNode.GENE:
      return 35;
    default:
      return 10;
  }
};

// Función para definir el color de los nodos según el tipo
export const getNodeColor = (node: Node): string => {
  let keyShape = node.labels[0];
  if ('properties' in node && 'shape' in node.properties) {
    keyShape =
      node.properties.shape.charAt(0).toUpperCase() +
      node.properties.shape.slice(1);
  }
  switch (keyShape) {
    case typeNode.NPATHWAY:
      return 'lightblue';
    case typeNode.GENE:
      return 'red';
    case typeNode.FUNCTION:
      return 'lightgray';
    case typeNode.METABOLITE:
      return 'white';
    default:
      return 'lightgreen';
  }
};

export const getNodeId = (node: Node): string => {
  return node.labels[0] + '_' + node.properties.id.replaceAll(' ', '_');
};
