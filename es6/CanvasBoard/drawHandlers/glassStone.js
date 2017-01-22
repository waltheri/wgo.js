import { WHITE } from "../../core";
import shadow from "./stoneShadow";

export default {
    // draw handler for stone layer
    stone: {
        // drawing function - args object contain info about drawing object, board is main board object
        draw: function (canvasCtx, args, board) {
            const stoneRadius = board.stoneRadius;
            var radgrad;

            // set stone texture
            if (args.c == WHITE) {
                radgrad = canvasCtx.createRadialGradient(
                    -2 * stoneRadius / 5,
                    -2 * stoneRadius / 5,
                    stoneRadius / 3,
                    -stoneRadius / 5,
                    -stoneRadius / 5,
                    5 * stoneRadius / 5
                );
                radgrad.addColorStop(0, '#fff');
                radgrad.addColorStop(1, '#aaa');
            }
            else {
                radgrad = canvasCtx.createRadialGradient(
                    -2 * stoneRadius / 5,
                    -2 * stoneRadius / 5,
                    1,
                    -stoneRadius / 5,
                    -stoneRadius / 5,
                    4 * stoneRadius / 5
                );
                radgrad.addColorStop(0, '#666');
                radgrad.addColorStop(1, '#000');
            }

            // paint stone
            canvasCtx.beginPath();
            canvasCtx.fillStyle = radgrad;
            canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
            canvasCtx.fill();
        }
    },

    // adding shadow
    shadow,
}
