import { LifeCycleEvent } from './types';
import { Color, Point } from '../types';
export declare function beforeInitSZ(event: LifeCycleEvent<number>): void;
export declare function beforeInitRU(event: LifeCycleEvent<string>): void;
export declare function applyGameChangesHA(event: LifeCycleEvent<number>): void;
export declare function applyGameChangesMove(event: LifeCycleEvent<Point>): void;
export declare function applyGameChangesPL(event: LifeCycleEvent<Color.BLACK | Color.WHITE>): void;
export declare function applyGameChangesSetup(event: LifeCycleEvent<Point[]>): void;
