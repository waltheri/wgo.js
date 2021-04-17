import { PropIdent } from '../../SGFParser/sgfTypes';
import makeConfig, { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';

export interface GameInfoBoxConfig {
  gameInfoProperties: { [key: string]: string };
  hideResult: boolean;
}

export const gameInfoBoxDefaultConfig = {
  gameInfoProperties: {
    DT: 'Date',
    KM: 'Komi',
    HA: 'Handicap',
    AN: 'Annotations',
    CP: 'Copyright',
    GC: 'Game comments',
    GN: 'Game name',
    ON: 'Fuseki',
    OT: 'Overtime',
    TM: 'Basic time',
    RE: 'Result',
    RO: 'Round',
    RU: 'Rules',
    US: 'Recorder',
    PC: 'Place',
    EV: 'Event',
    SO: 'Source',
  },
  hideResult: true,
};

export default class GameInfoBox implements PlayerDOMComponent {
  element: HTMLElement;
  infoTable: HTMLElement;
  player: PlayerDOM;
  config: GameInfoBoxConfig;

  constructor(config: PartialRecursive<GameInfoBoxConfig> = {}) {
    this.config = makeConfig(gameInfoBoxDefaultConfig, config);
    this.printInfo = this.printInfo.bind(this);

    this.element = document.createElement('div');
    this.element.className = 'wgo-player__box wgo-player__box--content';

    const title = document.createElement('div');
    title.innerHTML = 'Game information';
    title.className = 'wgo-player__box__title';
    this.element.appendChild(title);

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'wgo-player__box__content';
    this.element.appendChild(tableWrapper);

    this.infoTable = document.createElement('table');
    this.infoTable.className = 'wgo-player__box__game-info';
    tableWrapper.appendChild(this.infoTable);
  }

  create(player: PlayerDOM) {
    this.player = player;
    this.player.on('beforeInit', this.printInfo);
    this.printInfo();
  }

  destroy() {
    this.player.off('beforeInit', this.printInfo);
    this.player = null;
  }

  addInfo(propIdent: string, value: string, hide: boolean) {
    const row = document.createElement('tr');
    row.dataset.propIdent = propIdent;
    this.infoTable.appendChild(row);

    const label = document.createElement('th');
    label.textContent = this.config.gameInfoProperties[propIdent];
    row.appendChild(label);

    const valueElement = document.createElement('td');
    if (hide) {
      const link = document.createElement('a');
      link.href = '#';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        valueElement.textContent = value;
      });
      link.textContent = 'show';
      valueElement.appendChild(link);
    } else {
      valueElement.textContent = value;
    }
    row.appendChild(valueElement);
  }

  removeInfo(propIdent: string) {
    const elem = this.infoTable.querySelector(`[data-id='${propIdent}']`);
    this.infoTable.removeChild(elem);
  }

  printInfo() {
    this.infoTable.innerHTML = '';
    if (this.player.rootNode) {
      this.player.rootNode.forEachProperty((propIdent, value) => {
        if (this.config.gameInfoProperties[propIdent]) {
          this.addInfo(propIdent, value, this.config.hideResult && propIdent === PropIdent.RESULT);
        }
      });
    }
  }
}
