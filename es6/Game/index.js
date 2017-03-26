// Game module
import Game from "./Game";
import Position from "./Position";
import * as errorCodes from "./errors";
import rules from "./rules";

const defaultSize = 19;
const defaultRules = "Japanese";

Game.Position = Position;
Game.rules = rules;
Game.defaultRules = defaultRules;
Game.defaultSize = defaultSize;
Game.errorCodes = errorCodes;

export default Game;
export { Position, rules, defaultRules, defaultSize, errorCodes };
