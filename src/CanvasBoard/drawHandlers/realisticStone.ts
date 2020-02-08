/* global window */
import { CanvasBoardConfig } from '../types';
import { BoardObject } from '../boardObjects';
import DrawHandler from './DrawHandler';
import Stone from './Stone';

// Check if image has been loaded properly
// see https://stereochro.me/ideas/detecting-broken-images-js
/*function isOkay(img: any) {
  if (typeof img === 'string') { return false; }
  if (!img.complete) { return false; }
  if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
    return false;
  }
  return true;
}*/

export default class RealisticStone extends Stone {
  images: HTMLImageElement[];
  fallback: DrawHandler;
  randSeed: number;
  redrawRequest: number;

  constructor (paths: string[], fallback: DrawHandler) {
    super();
    this.fallback = fallback;
    this.randSeed = Math.ceil(Math.random() * 9999999);
    this.images = [];
    this.loadImages(paths);
  }

  loadImages(paths: string[]) {
    if (paths[0]) {
      const image = new Image();
      image.onload = () => {
        this.images.push(image);
        this.loadImages(paths.slice(1));
      };
      image.onerror = () => {
        this.loadImages(paths.slice(1));
      };
      image.src = paths[0];
    }
  }

  stone (canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardObject) {
    const count = this.images.length;

    if (count) {
      const stoneRadius = boardConfig.theme.stoneSize;
      const idx = this.randSeed % (count + boardObject.x * boardConfig.size + boardObject.y) % count;
      canvasCtx.drawImage(this.images[idx], -stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
    } else {
      // Fall back to SHELL handler if there was a problem loading the image
      this.fallback.stone(canvasCtx, boardConfig, boardObject);
    }
  }
}
