import { WHITE } from "../../core";
import shadow from "./stoneShadow";

export default {
    // draw handler for stone layer
    stone: {
        // drawing function - args object contain info about drawing object, board is main board object
        draw: function (canvasCtx, {x, y, stoneRadius}, {c}) {
            var radgrad;

            // set stone texture
            if (c == WHITE) {
                radgrad = canvasCtx.createRadialGradient(
                    x - 2 * stoneRadius / 5,
                    y - 2 * stoneRadius / 5,
                    stoneRadius / 3,
                    x - stoneRadius / 5,
                    y - stoneRadius / 5,
                    5 * stoneRadius / 5
                );
                radgrad.addColorStop(0, '#fff');
                radgrad.addColorStop(1, '#aaa');
            }
            else {
                radgrad = canvasCtx.createRadialGradient(
                    x - 2 * stoneRadius / 5,
                    y - 2 * stoneRadius / 5,
                    1,
                    x - stoneRadius / 5,
                    y - stoneRadius / 5,
                    4 * stoneRadius / 5
                );
                radgrad.addColorStop(0, '#666');
                radgrad.addColorStop(1, '#000');
            }

            // paint stone
            canvasCtx.beginPath();
            canvasCtx.fillStyle = radgrad;
            canvasCtx.arc(x, y, stoneRadius, 0, 2 * Math.PI, true);
            canvasCtx.fill();
        }
    },

    // adding shadow
    shadow,
}
