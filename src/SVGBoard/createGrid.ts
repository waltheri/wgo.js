import { NS, SVGBoardConfig } from './types';

function line(fromX: number, fromY: number, toX: number, toY: number) {
  const line = document.createElementNS(NS, 'line');
  line.setAttribute('x1', fromX as any);
  line.setAttribute('y1', fromY as any);
  line.setAttribute('x2', toX as any);
  line.setAttribute('y2', toY as any);

  return line;
}

function star(x: number, y: number, starSize: number) {
  const star = document.createElementNS(NS, 'circle');
  star.setAttribute('cx', x as any);
  star.setAttribute('cy', y as any);
  star.setAttribute('r', starSize as any);
  star.setAttribute('fill', '#553310');
  star.setAttribute('stroke-width', '0');

  return star;
}

export default function createGrid(config: SVGBoardConfig) {
  const { linesWidth } = config.theme.grid;

  const grid = document.createElementNS(NS, 'g');
  grid.setAttribute('stroke', config.theme.grid.linesColor);
  grid.setAttribute('stroke-width', linesWidth.toString());
  grid.setAttribute('fill', config.theme.grid.starColor);

  for (let i = 0; i < config.size; i++) {
    grid.appendChild(line(i, 0 - linesWidth / 2, i, config.size - 1 + linesWidth / 2));
    grid.appendChild(line(0 - linesWidth / 2, i, config.size - 1 + linesWidth / 2, i));
  }

  const starPoints = config.starPoints[config.size];

  if (starPoints) {
    starPoints.forEach((starPoint) => {
      grid.appendChild(star(starPoint.x, starPoint.y, config.theme.grid.starSize));
    });
  }
  return grid;
}
