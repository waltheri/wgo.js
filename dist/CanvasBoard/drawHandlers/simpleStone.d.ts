import CanvasBoard from '..';
export default function (color: string): {
    stone: {
        draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
    };
};
