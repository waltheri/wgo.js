import { GoRules } from '../Game';
import PlayerBase from './PlayerBase';
import { PropIdent } from '../SGFParser/sgfTypes';
export interface PlayerInitParams {
    size: number;
    rules: GoRules;
    [key: string]: any;
}
export interface LifeCycleEvent<V, D = void> {
    target: PlayerBase;
    name: string;
    propIdent: PropIdent;
    value: V;
}
