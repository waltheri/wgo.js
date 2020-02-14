import PlayerBase from '../PlayerBase';
import EventEmitter from '../../utils/EventEmitter';

export default abstract class PropertyHandler<V, D = void> {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  beforeInit?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  afterInit?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  beforeMove?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  afterMove?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  nextNode?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  previousNode?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  beforeNextNode?(valueOrValues: V, propertyData: D, player: PlayerBase): D;
  beforePreviousNode?(valueOrValues: V, propertyData: D, player: PlayerBase): D;

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
          setPropertyData((this[event] as Function)(value, propertyData, player));
        },
      );
    }
  }
}
