import { Color } from '../../types';
import { LifeCycleEvent } from '../../PlayerBase/types';
import PlayerDOMComponent from './PlayerDOMComponent';
import { PlayerDOM } from '../..';
export default class PlayerTag implements PlayerDOMComponent {
    element: HTMLElement;
    player: PlayerDOM;
    color: Color;
    colorChar: 'B' | 'W';
    colorName: 'black' | 'white';
    playerNameElement: HTMLElement;
    playerRankElement: HTMLElement;
    playerTeamElement: HTMLElement;
    playerCapsElement: HTMLElement;
    constructor(color: Color.B | Color.W);
    create(player: PlayerDOM): void;
    destroy(): void;
    setName(event: LifeCycleEvent<string>): void;
    setRank(event: LifeCycleEvent<string>): void;
    setTeam(event: LifeCycleEvent<string>): void;
    setCaps(): void;
    private initialSet;
}
