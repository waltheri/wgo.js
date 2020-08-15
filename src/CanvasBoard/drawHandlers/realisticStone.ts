/* global window */
import { CanvasBoardConfig } from '../types';
import { FieldObject } from '../../BoardBase';
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
  paths: string[];
  images: { [path: string]: HTMLImageElement };
  fallback: DrawHandler;
  randSeed: number;
  redrawRequest: number;

  constructor (paths: string[], fallback: DrawHandler) {
    super();
    this.fallback = fallback;
    this.randSeed = Math.ceil(Math.random() * 9999999);
    this.images = {};
    this.paths = paths;
  }

  loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject();
      };
      image.src = path;
    });
  }

  stone (canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: FieldObject) {
    const count = this.paths.length;

    if (count) {
      const stoneRadius = boardConfig.theme.stoneSize;
      const idx = this.randSeed % (count + boardObject.x * boardConfig.size + boardObject.y) % count;

      if (this.images[this.paths[idx]]) {
        canvasCtx.drawImage(this.images[this.paths[idx]], -stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
      } else {
        this.fallback.stone(canvasCtx, boardConfig, boardObject);

        const path = this.paths[idx];
        return this.loadImage(path).then((image) => {
          this.images[path] = image;
        }).catch(() => {
          this.paths = this.paths.filter(p => p !== path);
        });
      }
    } else {
      this.fallback.stone(canvasCtx, boardConfig, boardObject);
    }
  }
}
