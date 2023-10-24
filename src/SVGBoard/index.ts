import { Namespace } from '../types';
import * as svgDrawHandlers from './svgDrawHandlers';
export { default as SVGBoard } from './SVGBoard';
export * from './types';
export { svgDrawHandlers };
export { default as SVGFieldDrawHandler } from './svgDrawHandlers/SVGFieldDrawHandler';
export { default as SVGMarkupDrawHandler } from './svgDrawHandlers/SVGMarkupDrawHandler';
export type { SVGMarkupDrawHandlerParams } from './svgDrawHandlers/SVGMarkupDrawHandler';
export { default as SVGStoneDrawHandler } from './svgDrawHandlers/SVGStoneDrawHandler';

export const SVGRenderer = svgDrawHandlers as Namespace<typeof svgDrawHandlers>;
