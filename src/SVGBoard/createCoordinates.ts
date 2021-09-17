import SVGBoard from './SVGBoard';
import { SVG_NS } from './types';

function letter(x: number, y: number, str: string) {
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', x as any);
  text.setAttribute('y', y as any);
  text.textContent = str;

  return text;
}

export default function createCoordinates(board: SVGBoard) {
  const coordinates = document.createElementNS(SVG_NS, 'g');
  coordinates.style.userSelect = 'none';

  const { theme } = board.config;
  const size = board.getSize();
  const {
    fontSize,
    color,
    labelsX,
    labelsY,
    top,
    bottom,
    right,
    left,
  } = theme.coordinates;

  coordinates.setAttribute('font-family', theme.font);
  coordinates.setAttribute('font-size', fontSize as any);
  coordinates.setAttribute('text-anchor', 'middle');
  coordinates.setAttribute('dominant-baseline', 'middle');

  if (theme.coordinates.bold) {
    coordinates.setAttribute('font-weight', 'bold');
  }

  coordinates.setAttribute('fill', color);

  for (let i = 0; i < size.y; i++) {
    if (left) {
      coordinates.appendChild(letter(-0.75, size.y - i - 1, labelsY[i] as string));
    }
    if (right) {
      coordinates.appendChild(letter(size.x - 0.25, size.y - i - 1, labelsY[i] as string));
    }
  }

  for (let i = 0; i < size.x; i++) {
    if (top) {
      coordinates.appendChild(letter(i, -0.75, labelsX[i] as string));
    }
    if (bottom) {
      coordinates.appendChild(letter(i, size.y - 0.25, labelsX[i] as string));
    }
  }
  
  return coordinates;
}
