import CanvasLayer from './CanvasLayer';

export default class GridLayer extends CanvasLayer {
  init() {
    super.init();
    this.drawGrid();
  }

  clear() {
    super.clear();
    this.drawGrid();
  }

  drawGrid() {
    // draw grid
    let tmp;
    const params = this.board.config.theme.grid;

    this.context.beginPath();
    this.context.lineWidth = params.linesWidth * this.board.fieldSize;
    this.context.strokeStyle = params.linesColor;

    const tx = Math.round(this.board.getX(0));
    const ty = Math.round(this.board.getY(0));
    const bw = Math.round((this.board.config.size - 1) * this.board.fieldSize);
    const bh = Math.round((this.board.config.size - 1) * this.board.fieldSize);

    this.context.strokeRect(tx, ty, bw, bh);

    for (let i = 1; i < this.board.config.size - 1; i++) {
      tmp = Math.round(this.board.getX(i));
      this.context.moveTo(tmp, ty);
      this.context.lineTo(tmp, ty + bh);

      tmp = Math.round(this.board.getY(i));
      this.context.moveTo(tx, tmp);
      this.context.lineTo(tx + bw, tmp);
    }

    this.context.stroke();

    // draw stars
    this.context.fillStyle = params.starColor;

    if (this.board.config.starPoints[this.board.config.size]) {
      for (const key in this.board.config.starPoints[this.board.config.size]) {
        this.context.beginPath();
        this.context.arc(
          this.board.getX(this.board.config.starPoints[this.board.config.size][key].x),
          this.board.getY(this.board.config.starPoints[this.board.config.size][key].y),
          params.starSize * this.board.fieldSize, 0, 2 * Math.PI, true,
        );
        this.context.fill();
      }
    }

    if (this.board.config.coordinates) {
      this.drawCoordinates();
    }
  }

  drawCoordinates() {
    let t;
    const params = this.board.config.theme.coordinates;

    this.context.fillStyle = params.color;
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';
    // tslint:disable-next-line:max-line-length
    this.context.font = `${params.bold ? 'bold ' : ''}${this.board.fieldSize / 2}px ${this.board.config.theme.font || ''}`;

    const xRight = this.board.getX(-0.75);
    const xLeft = this.board.getX(this.board.config.size - 0.25);
    const yTop = this.board.getY(-0.75);
    const yBottom = this.board.getY(this.board.config.size - 0.25);

    const coordinatesX = params.x;
    const coordinatesY = params.y;

    for (let i = 0; i < this.board.config.size; i++) {
      t = this.board.getY(i);
      this.context.fillText(coordinatesX[i] as string, xRight, t);
      this.context.fillText(coordinatesX[i] as string, xLeft, t);

      t = this.board.getX(i);
      this.context.fillText(coordinatesY[i] as string, t, yTop);
      this.context.fillText(coordinatesY[i] as string, t, yBottom);
    }

    this.context.fillStyle = 'black';
  }
}
