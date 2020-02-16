import PlayerBase from '../PlayerBase';
import EventEmitter from '../../utils/EventEmitter';

export default abstract class PropertyHandler<V, D = void> {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  beforeInit?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  afterInit?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  beforeMove?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  afterMove?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  nextNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  previousNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  beforeNextNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
  beforePreviousNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;

  register(player: PlayerBase) {
    this.registerEvent(player, 'beforeInit');
    this.registerEvent(player, 'afterInit');
    this.registerEvent(player, 'beforeMove');
    this.registerEvent(player, 'afterMove');
    this.registerEvent(player, 'nextNode');
    this.registerEvent(player, 'previousNode');
    this.registerEvent(player, 'beforeNextNode');
    this.registerEvent(player, 'beforePreviousNode');
  }

  private registerEvent(player: PlayerBase, event: keyof PropertyHandler<V, D>) {
    if (this[event]) {
      player.on(
        `${event}:${this.type}`,
        (value: V, propertyData: D, setPropertyData: (data: D) => void) => {
          setPropertyData((this[event] as Function)(value, player, propertyData));
        },
      );
    }
  }
}
