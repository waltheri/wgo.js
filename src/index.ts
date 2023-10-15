// All public API is exported here

// Core
export { Color } from './types';
export { version } from '../package.json';

// SGF parser
export * from './sgf';

// Go game record (kifu) related
export * from './kifu';

// Go game evaluation
export * from './game';

/*
// Game logic

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
*/
