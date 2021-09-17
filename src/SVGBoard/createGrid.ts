import SVGBoard from './SVGBoard';
import { SVG_NS } from './types';

function line(fromX: number, fromY: number, toX: number, toY: number) {
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', fromX as any);
  line.setAttribute('y1', fromY as any);
  line.setAttribute('x2', toX as any);
  line.setAttribute('y2', toY as any);

  return line;
}

function star(x: number, y: number, starSize: number) {
  const star = document.createElementNS(SVG_NS, 'circle');
  star.setAttribute('cx', x as any);
  star.setAttribute('cy', y as any);
  star.setAttribute('r', starSize as any);
  star.setAttribute('fill', '#553310');
  star.setAttribute('stroke-width', '0');

  return star;
}

export default function createGrid(board: SVGBoard) {
  const { theme } = board.config;
  const { linesWidth } = theme.grid;
  const size = board.getSize();

  const grid = document.createElementNS(SVG_NS, 'g');
  grid.setAttribute('stroke', theme.grid.linesColor);
  grid.setAttribute('stroke-width', linesWidth.toString());
  grid.setAttribute('fill', theme.grid.starColor);

  for (let i = 0; i < size.y; i++) {
    grid.appendChild(line(0 - linesWidth / 2, i, size.x - 1 + linesWidth / 2, i));
  }

  for (let i = 0; i < size.x; i++) {
    grid.appendChild(line(i, 0 - linesWidth / 2, i, size.y - 1 + linesWidth / 2));
  }

  const starPointsKey = size.x === size.y ? size.x : `${size.x}x${size.y}`;
  const starPoints = (theme.starPoints as any)[starPointsKey];

  if (starPoints) {
    starPoints.forEach((starPoint: any) => {
      grid.appendChild(star(starPoint.x, starPoint.y, theme.grid.starSize));
    });
  }
  return grid;
}
