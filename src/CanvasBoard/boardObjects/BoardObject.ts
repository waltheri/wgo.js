import { DrawHandler } from '../drawHandlers';

export default class BoardObject {
  type: string | DrawHandler;
  zIndex: number = 0;

  constructor(type: string | DrawHandler) {
    this.type = type;
  }
}
