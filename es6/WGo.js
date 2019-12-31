// WGo module

import Game from "./Game";
import Position from "./Game/Position";
import SGFParser from "./SGFParser";
import KNode from "./Kifu/KNode";
import CanvasBoard from "./CanvasBoard";
import Kifu from "./Kifu";
import Player from "./Player";

/*WGo.Game = Game;
WGo.Position = Position;
WGo.SGFParser = SGFParser;
WGo.KNode = KNode;*/
//WGo.CanvasBoard = CanvasBoard;

export * from "./core";
export {Game, Position, SGFParser, KNode, CanvasBoard, Kifu, Player};
