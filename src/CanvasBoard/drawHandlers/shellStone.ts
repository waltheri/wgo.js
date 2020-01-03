import shadow from './stoneShadow';
import CanvasBoard from '..';
import { Color } from '../../types';

// shell stone helping functions
const shellSeed = Math.ceil(Math.random() * 9999999);

// tslint:disable-next-line:max-line-length
const drawShellLine = function (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, startAngle: number, endAngle: number, factor: number, thickness: number) {
  ctx.strokeStyle = 'rgba(64,64,64,0.2)';

  ctx.lineWidth = (r / 30) * thickness;
  ctx.beginPath();

  const radius = r - Math.max(1, ctx.lineWidth);

  const x1 = x + radius * Math.cos(startAngle * Math.PI);
  const y1 = y + radius * Math.sin(startAngle * Math.PI);
  const x2 = x + radius * Math.cos(endAngle * Math.PI);
  const y2 = y + radius * Math.sin(endAngle * Math.PI);

  let m;
  let angle;
  let diffX;
  let diffY;

  if (x2 > x1) {
    m = (y2 - y1) / (x2 - x1);
    angle = Math.atan(m);
  } else if (x2 === x1) {
    angle = Math.PI / 2;
  } else {
    m = (y2 - y1) / (x2 - x1);
    angle = Math.atan(m) - Math.PI;
  }

  const c = factor * radius;
  diffX = Math.sin(angle) * c;
  diffY = Math.cos(angle) * c;

  const bx1 = x1 + diffX;
  const by1 = y1 - diffY;

  const bx2 = x2 + diffX;
  const by2 = y2 - diffY;

  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(bx1, by1, bx2, by2, x2, y2);
  ctx.stroke();
};

const drawShell = function (arg: any) {
  let fromAngle = arg.angle;
  let toAngle = arg.angle;

  for (let i = 0; i < arg.lines.length; i++) {
    fromAngle += arg.lines[i];
    toAngle -= arg.lines[i];
    drawShellLine(arg.ctx, arg.x, arg.y, arg.radius, fromAngle, toAngle, arg.factor, arg.thickness);
  }
};

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.stoneRadius;
      let radgrad;

      if (args.c === Color.WHITE) {
        radgrad = '#aaa';
      } else {
        radgrad = '#000';
      }

      canvasCtx.beginPath();
      canvasCtx.fillStyle = radgrad;
      canvasCtx.arc(0, 0, Math.max(0, stoneRadius - 0.5), 0, 2 * Math.PI, true);
      canvasCtx.fill();

      // do shell magic here
      if (args.c === Color.WHITE) {
        // do shell magic here
        const type = shellSeed % (3 + args.x * board.size + args.y) % 3;
        const z = board.size * board.size + args.x * board.size + args.y;
        const angle = (2 / z) * (shellSeed % z);

        if (type === 0) {
          drawShell({
            ctx: canvasCtx,
            x: 0,
            y: 0,
            radius: stoneRadius,
            angle,
            lines: [0.10, 0.12, 0.11, 0.10, 0.09, 0.09, 0.09, 0.09],
            factor: 0.25,
            thickness: 1.75,
          });
        } else if (type === 1) {
          drawShell({
            ctx: canvasCtx,
            x: 0,
            y: 0,
            radius: stoneRadius,
            angle,
            lines: [0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
            factor: 0.2,
            thickness: 1.5,
          });
        } else {
          drawShell({
            ctx: canvasCtx,
            x: 0,
            y: 0,
            radius: stoneRadius,
            angle,
            lines: [0.12, 0.14, 0.13, 0.12, 0.12, 0.12],
            factor: 0.3,
            thickness: 2,
          });
        }
        radgrad = canvasCtx.createRadialGradient(
          -2 * stoneRadius / 5,
          -2 * stoneRadius / 5,
          stoneRadius / 3,
          -stoneRadius / 5,
          -stoneRadius / 5,
          5 * stoneRadius / 5,
        );
        radgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
        radgrad.addColorStop(1, 'rgba(255,255,255,0)');

        // add radial gradient //
        canvasCtx.beginPath();
        canvasCtx.fillStyle = radgrad;
        canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
        canvasCtx.fill();
      } else {
        radgrad = canvasCtx.createRadialGradient(
          0.4 * stoneRadius,
          0.4 * stoneRadius,
          0, 0.5 * stoneRadius,
          0.5 * stoneRadius,
          stoneRadius,
        );
        radgrad.addColorStop(0, 'rgba(32,32,32,1)');
        radgrad.addColorStop(1, 'rgba(0,0,0,0)');

        canvasCtx.beginPath();
        canvasCtx.fillStyle = radgrad;
        canvasCtx.arc(
          0,
          0,
          stoneRadius,
          0,
          2 * Math.PI,
          true,
        );
        canvasCtx.fill();

        radgrad = canvasCtx.createRadialGradient(
          -0.4 * stoneRadius,
          -0.4 * stoneRadius,
          1,
          -0.5 * stoneRadius,
          -0.5 * stoneRadius,
          1.5 * stoneRadius,
        );
        radgrad.addColorStop(0, 'rgba(64,64,64,1)');
        radgrad.addColorStop(1, 'rgba(0,0,0,0)');

        canvasCtx.beginPath();
        canvasCtx.fillStyle = radgrad;
        canvasCtx.arc(
          0,
          0,
          stoneRadius,
          0,
          2 * Math.PI,
          true,
        );
        canvasCtx.fill();
      }
    },
  },
  shadow,
};
