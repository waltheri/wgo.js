import DrawHandler from './DrawHandler';
/**
 * TODO: rename this
 */
export default class Dot extends DrawHandler<{
    color: string;
}> {
    stone(canvasCtx: CanvasRenderingContext2D): void;
}
