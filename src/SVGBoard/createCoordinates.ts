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

  coordinates.setAttribute('font-family', config.theme.font);
  coordinates.setAttribute('font-size', config.theme.coordinates.fontSize as any);
  coordinates.setAttribute('text-anchor', 'middle');
  coordinates.setAttribute('dominant-baseline', 'middle');

  if (config.theme.coordinates.bold) {
    coordinates.setAttribute('font-weight', 'bold');
  }

  coordinates.setAttribute('fill', config.theme.coordinates.color);

  for (let i = 0; i < config.size; i++) {
    if (config.theme.coordinatesTop) {
      coordinates.appendChild(letter(i, -0.75, config.coordinateLabelsX[i] as string));
    }
    if (config.theme.coordinatesBottom) {
      coordinates.appendChild(letter(i, config.size - 0.25, config.coordinateLabelsX[i] as string));
    }
    if (config.theme.coordinatesLeft) {
      coordinates.appendChild(letter(-0.75, config.size - i - 1, config.coordinateLabelsY[i] as string));
    }
    if (config.theme.coordinatesRight) {
      coordinates.appendChild(letter(config.size - 0.25, config.size - i - 1, config.coordinateLabelsY[i] as string));
    }
  }

  return coordinates;
}
