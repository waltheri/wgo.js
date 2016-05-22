// WGo module

import * as core from "./core.js";
import Game from "./Game.js";
import Position from "./Game.js";
import SGFParser, {SGFSyntaxError} from "./kifu/SGFParser.js";
import KNode from "./kifu/KNode.js";
import CanvasBoard from "./CanvasBoard.js";

/*WGo.Game = Game;
WGo.Position = Position;
WGo.SGFParser = SGFParser;
WGo.KNode = KNode;*/
//WGo.CanvasBoard = CanvasBoard;

SGFParser.SGFSyntaxError = SGFSyntaxError;

export * from "./core.js";
export {Game, Position, SGFParser, KNode, CanvasBoard};
