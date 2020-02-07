import { CanvasBoardConfig } from '../types';
export default function simpleStoneFactory(color: string): {
    new (params?: {}): {
        drawStone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotate: number;
        opacity: number;
        drawShadow?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
        drawGrid?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
        params: {};
        setPosition(x: number, y: number): void;
        setScale(factor: number): void;
        setOpacity(value: number): void;
    };
};
