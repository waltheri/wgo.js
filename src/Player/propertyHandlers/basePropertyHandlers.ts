import SetupHandler from './SetupHandler';
import SetTurnHandler from './SetTurnHandler';
import { Color } from '../../types';
import BoardSizeHandler from './BoardSizeHandler';
import RulesHandler from './RulesHandler';
import HandicapHandler from './HandicapHandler';

export default [
  new BoardSizeHandler(),
  new RulesHandler(),
  new HandicapHandler(),
  new SetupHandler('AW', Color.WHITE),
  new SetupHandler('AB', Color.BLACK),
  new SetupHandler('AE', Color.EMPTY),
  new SetTurnHandler(),
];
