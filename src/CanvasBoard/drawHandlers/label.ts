import CanvasBoard from '..';

export default {
  stone: {
    draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const font = args.font || board.config.theme.font || '';

      canvasCtx.fillStyle = args.color || board.config.theme.markupNoneColor;

      let fontSize = 0.5;

      if (args.text.length === 1) {
        fontSize = 0.75;
      } else if (args.text.length === 2) {
        fontSize = 0.6;
      }

      canvasCtx.beginPath();
      canvasCtx.textBaseline = 'middle';
      canvasCtx.textAlign = 'center';
      canvasCtx.font = `${fontSize}px ${font}`;
      canvasCtx.fillText(args.text, 0, 0.02 + (fontSize - 0.5) * 0.08, 2);
    },
  },
};
