// Game module
import Game from "./Game";
import Position from "./Position";
import * as errorCodes from "./errors";
import rules, { JAPANESE_RULES } from "./rules";

const defaultSize = 19;

Game.Position = Position;
Game.rules = rules;
Game.defaultRules = JAPANESE_RULES;
Game.defaultSize = defaultSize;
Game.errorCodes = errorCodes;

export default Game;
export { Position, rules, JAPANESE_RULES as defaultRules, defaultSize, errorCodes };
