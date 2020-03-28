import SimplePlayer from '../SimplePlayer';
import Component from './Component';

const gameInfoProperties: { [key: string]: string } = {
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
};

export default class GameInfoBox extends Component {
  element: HTMLElement;
  infoTable: HTMLElement;

  constructor(player: SimplePlayer) {
    super(player);

    this.printInfo = this.printInfo.bind(this);
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'wgo-player__box wgo-player__box--content';

    const title = document.createElement('div');
    title.innerHTML = 'Game information';
    title.className = 'wgo-player__box__title';
    this.element.appendChild(title);

    this.infoTable = document.createElement('table');
    this.infoTable.className = 'wgo-player__box__game-info';
    this.element.appendChild(this.infoTable);

    this.player.on('beforeInit', this.printInfo);

    return this.element;
  }

  destroy() {
    this.player.off('beforeInit', this.printInfo);
  }

  addInfo(propIdent: string, value: string) {
    const row = document.createElement('tr');
    row.dataset.propIdent = propIdent;
    this.infoTable.appendChild(row);

    const label = document.createElement('th');
    label.textContent = gameInfoProperties[propIdent];
    row.appendChild(label);

    const valueElement = document.createElement('td');
    valueElement.textContent = value;
    row.appendChild(valueElement);
  }

  removeInfo(propIdent: string) {
    const elem = this.infoTable.querySelector(`[data-id='${propIdent}']`);
    this.infoTable.removeChild(elem);
  }

  printInfo() {
    this.infoTable.innerHTML = '';

    this.player.rootNode.forEachProperty((propIdent, value) => {
      if (gameInfoProperties[propIdent]) {
        this.addInfo(propIdent, value);
      }
    });
  }
}
