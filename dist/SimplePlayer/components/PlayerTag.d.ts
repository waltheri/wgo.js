import Component from './Component';
import SimplePlayer from '../SimplePlayer';
import { Color } from '../../types';
import { LifeCycleEvent } from '../../PlayerBase/types';
export default class PlayerTag extends Component {
    color: Color;
    colorChar: 'B' | 'W';
    colorName: 'black' | 'white';
    element: HTMLElement;
    playerNameElement: HTMLElement;
    playerRankElement: HTMLElement;
    playerTeamElement: HTMLElement;
    playerCapsElement: HTMLElement;
    constructor(player: SimplePlayer, color: Color.B | Color.W);
    create(): HTMLElement;
    destroy(): void;
    setName(event: LifeCycleEvent<string>): void;
    setRank(event: LifeCycleEvent<string>): void;
    setTeam(event: LifeCycleEvent<string>): void;
    setCaps(): void;
}
