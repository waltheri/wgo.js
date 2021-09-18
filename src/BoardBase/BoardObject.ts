/**
 * Represents generic board object specified by type, which can be painted on the board.
 * It contains z-index and opacity.
 */
export default class BoardObject {
  readonly type: string;

  zIndex: number = 0;
  opacity: number = 1;

  constructor(type: string) {
    this.type = type;
  }
}
