import Node from '../../types/graphic/Node';
import Relationship from '../../types/graphic/Link';

export const showTooltip = (
  tooltip: HTMLDivElement | null,
  event: MouseEvent,
  data: Node | Relationship,
) => {
  if (tooltip) {
    tooltip.style.display = 'block';

    if ('type' in data) {
      tooltip.innerHTML = `Source: ${data.source}<br>Target: ${data.target}<br>Type: ${data.type}`;
    } else {
      tooltip.innerHTML = `ID: ${data.properties.id}<br>Name: ${data.properties.name}<br>Type: ${data.labels[0]}`;
    }
    tooltip.style.left = `${event.pageX + 10}px`; // Offset para que no se superponga
    tooltip.style.top = `${event.pageY + 10}px`; // Offset para que no se superponga
  }
};

export const moveTooltip = (
  tooltip: HTMLDivElement | null,
  event: MouseEvent,
) => {
  if (tooltip) {
    tooltip.style.left = `${event.pageX + 10}px`; // Actualiza la posición
    tooltip.style.top = `${event.pageY + 10}px`; // Actualiza la posición
  }
};

export const hideTooltip = (tooltip: HTMLDivElement | null) => {
  if (tooltip) {
    tooltip.style.display = 'none'; // Ocultar el tooltip
  }
};
