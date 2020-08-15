import Component from './Component';
import SimplePlayer from '../SimplePlayer';
import { Color } from '../../types';
import { LifeCycleEvent } from '../../PlayerBase/types';
export default class PlayerTag extends Component {
    player: SimplePlayer;
    color: Color;
    colorChar: 'B' | 'W';
    colorName: 'black' | 'white';
    element: HTMLElement;
    playerNameElement: HTMLElement;
    playerRankElement: HTMLElement;
    playerTeamElement: HTMLElement;
    playerCapsElement: HTMLElement;
    constructor(color: Color.B | Color.W);
    create(player: SimplePlayer): HTMLElement;
    destroy(): void;
    setName(event: LifeCycleEvent<string>): void;
    setRank(event: LifeCycleEvent<string>): void;
    setTeam(event: LifeCycleEvent<string>): void;
    setCaps(): void;
}
