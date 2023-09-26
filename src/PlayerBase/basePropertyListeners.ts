import { LifeCycleEvent } from './types';
import { PropIdent } from '../sgf';
import { Color, Point } from '../types';
import { goRules } from '../Game';

export function beforeInitSZ(event: LifeCycleEvent<number[]>) {
  event.target.params.size = event.value;
}

export function beforeInitRU(event: LifeCycleEvent<string>) {
  if ((goRules as any)[event.value]) {
    event.target.params.rules = (goRules as any)[event.value];
  }
}

export function applyGameChangesHA(event: LifeCycleEvent<number>) {
  if (
    event.value > 1 &&
    event.target.currentNode === event.target.rootNode &&
    !event.target.getProperty(PropIdent.SetTurn)
  ) {
    event.target.game.position.turn = Color.White;
  }
}

export function applyGameChangesMove(event: LifeCycleEvent<Point>) {
  const color = event.propIdent === 'B' ? Color.B : Color.W;

  // if this is false, move is pass
  if (event.value) {
    event.target.game.position.applyMove(event.value.x, event.value.y, color, true, true);
  }

  event.target.game.position.turn = -color;
}

export function applyGameChangesPL(event: LifeCycleEvent<Color.Black | Color.White>) {
  event.target.game.turn = event.value;
}

export function applyGameChangesSetup(event: LifeCycleEvent<Point[]>) {
  let color: Color;
  switch (event.propIdent) {
    case 'AB':
      color = Color.B;
      break;
    case 'AW':
      color = Color.W;
      break;
    case 'AE':
      color = Color.E;
      break;
  }

  event.value.forEach((value) => {
    // add stone
    event.target.game.setStone(value.x, value.y, color);
  });
}
