// All public API is exported here

// Core
export { Color } from './types';
export { version } from '../package.json';

// SGF parser
export * from './sgf';

// KifuNode related
export * from './kifu';

// Game logic
export * from './Game';

// UI Board
export * from './BoardBase';
export * from './SVGBoard';

// Player related
export { PlayerBase } from './PlayerBase';
export * from './PlayerBase/plugins';
export * from './PlayerBase/types';

export { default as PlayerDOM } from './PlayerDOM/PlayerDOM';
export * from './PlayerDOM/components';

export { default as SimplePlayer } from './SimplePlayer';
