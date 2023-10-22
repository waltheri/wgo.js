import { Color } from '../types';
import { Position } from './Position';

export class GameState {
  constructor(
    public position: Position = new Position(),
    public blackCaptures: number = 0,
    public whiteCaptures: number = 0,
    public player: Color.Black | Color.White = Color.Black,
  ) {}

  clone(): GameState {
    return new GameState(
      this.position.clone(),
      this.blackCaptures,
      this.whiteCaptures,
      this.player,
    );
  }
}
