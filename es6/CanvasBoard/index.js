import CanvasBoard from "./CanvasBoard";
import * as themes from "./themes";
import * as drawHandlers from "./drawHandlers";
import defaultConfig from "./defaultConfig";

CanvasBoard.drawHandlers = drawHandlers;
CanvasBoard.themes = themes;
CanvasBoard.defaultConfig = defaultConfig;

export default CanvasBoard;
export { themes, drawHandlers, defaultConfig };
