import DrawHandler from './DrawHandler';
export default class Dim extends DrawHandler<{
    color: string;
}> {
    stone(canvasCtx: CanvasRenderingContext2D): void;
}
