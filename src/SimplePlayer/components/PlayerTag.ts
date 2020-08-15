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

  constructor(color: Color.B | Color.W) {
    super();

    this.color = color;
    this.colorChar = color === Color.B ? 'B' : 'W';
    this.colorName = color === Color.B ? 'black' : 'white';

    this.setName = this.setName.bind(this);
    this.setRank = this.setRank.bind(this);
    this.setTeam = this.setTeam.bind(this);
    this.setCaps = this.setCaps.bind(this);
  }

  create(player: SimplePlayer) {
    this.player = player;

    // create HTML
    this.element = document.createElement('div');
    this.element.className = 'wgo-player__box wgo-player__player-tag';

    const playerElement = document.createElement('div');
    playerElement.className = 'wgo-player__player-tag__name';
    this.element.appendChild(playerElement);

    this.playerNameElement = document.createElement('span');
    playerElement.appendChild(this.playerNameElement);

    this.playerRankElement = document.createElement('small');
    this.playerRankElement.className = 'wgo-player__player-tag__name__rank';
    playerElement.appendChild(this.playerRankElement);

    this.playerCapsElement = document.createElement('div');
    this.playerCapsElement.className = `wgo-player__player-tag__color wgo-player__player-tag__color--${this.colorName}`;
    this.playerCapsElement.textContent = '0';
    this.element.appendChild(this.playerCapsElement);

    // todo team
    this.playerTeamElement = document.createElement('div');

    // attach Kifu listeners
    this.player.on(`beforeInit.P${this.colorChar}`, this.setName); // property PB or PW
    this.player.on(`beforeInit.${this.colorChar}R`, this.setRank); // property BR or WR
    this.player.on(`beforeInit.${this.colorChar}T`, this.setTeam); // property BT or WT
    this.player.on('applyNodeChanges', this.setCaps);

    this.initialSet();

    return this.element;
  }

  destroy() {
    this.player.off(`beforeInit.P${this.colorChar}`, this.setName);
    this.player.off(`beforeInit.${this.colorChar}R`, this.setRank);
    this.player.off(`beforeInit.${this.colorChar}T`, this.setTeam);
    this.player.off('applyNodeChanges', this.setCaps);
  }

  setName(event: LifeCycleEvent<string>) {
    this.playerNameElement.textContent = event.value;
  }

  setRank(event: LifeCycleEvent<string>) {
    this.playerRankElement.textContent = event.value;
  }

  setTeam(event: LifeCycleEvent<string>) {
    this.playerTeamElement.textContent = event.value;
  }

  setCaps() {
    this.playerCapsElement.textContent = this.player.game.position.capCount[this.colorName].toString();
  }

  private initialSet() {
    if (this.player.rootNode) {
      this.playerNameElement.textContent = this.player.rootNode.getProperty(`P${this.colorChar}`) || '';
      this.playerRankElement.textContent = this.player.rootNode.getProperty(`${this.colorChar}R`) || '';
      this.playerTeamElement.textContent = this.player.rootNode.getProperty(`${this.colorChar}T`) || '';
    }
    if (this.player.game) {
      this.setCaps();
    }
  }
}
