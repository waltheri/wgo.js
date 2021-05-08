import { SVG_NS, SVGBoardConfig } from './types';

function letter(x: number, y: number, str: string) {
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', x as any);
  text.setAttribute('y', y as any);
  text.textContent = str;

  return text;
}

export default function createCoordinates(config: SVGBoardConfig) {
  const coordinates = document.createElementNS(SVG_NS, 'g');
  coordinates.style.userSelect = 'none';

  const { size } = config;
  const {
    fontSize,
    color,
    labelsX,
    labelsY,
    top,
    bottom,
    right,
    left,
  } = config.theme.coordinates;

  coordinates.setAttribute('font-family', config.theme.font);
  coordinates.setAttribute('font-size', fontSize as any);
  coordinates.setAttribute('text-anchor', 'middle');
  coordinates.setAttribute('dominant-baseline', 'middle');

  if (config.theme.coordinates.bold) {
    coordinates.setAttribute('font-weight', 'bold');
  }

  coordinates.setAttribute('fill', color);

  for (let i = 0; i < size; i++) {
    if (top) {
      coordinates.appendChild(letter(i, -0.75, labelsX[i] as string));
    }
    if (bottom) {
      coordinates.appendChild(letter(i, size - 0.25, labelsX[i] as string));
    }
    if (left) {
      coordinates.appendChild(letter(-0.75, size - i - 1, labelsY[i] as string));
    }
    if (right) {
      coordinates.appendChild(letter(size - 0.25, size - i - 1, labelsY[i] as string));
    }
  }

  return coordinates;
}
