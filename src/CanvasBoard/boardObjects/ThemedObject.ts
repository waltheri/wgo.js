import BoardObject from './BoardObject';
import { CanvasBoardConfig } from '../types';

export default class ThemedObject extends BoardObject<any> {
  type: string;

  constructor(type: string, params: any) {
    super(params);
    this.type = type;
  }

  drawStone(context: CanvasRenderingContext2D, config: CanvasBoardConfig) {
    if (config.theme.drawHandlers[this.type].prototype.drawStone) {
      config.theme.drawHandlers[this.type].prototype.drawStone.call(this, context, config);
    }
  }

  drawGrid(context: CanvasRenderingContext2D, config: CanvasBoardConfig) {
    if (config.theme.drawHandlers[this.type].prototype.drawGrid) {
      config.theme.drawHandlers[this.type].prototype.drawGrid.call(this, context, config);
    }
  }

  drawShadow(context: CanvasRenderingContext2D, config: CanvasBoardConfig) {
    if (config.theme.drawHandlers[this.type].prototype.drawShadow) {
      config.theme.drawHandlers[this.type].prototype.drawShadow.call(this, context, config);
    }
  }
}
