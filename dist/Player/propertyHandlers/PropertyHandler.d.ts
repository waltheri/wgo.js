import PlayerBase from '../PlayerBase';
export default abstract class PropertyHandler<V, D = void> {
    type: string;
    constructor(type: string);
    beforeInit?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    afterInit?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    beforeMove?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    afterMove?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    nextNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    previousNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    beforeNextNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    beforePreviousNode?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    register(player: PlayerBase): void;
    private registerEvent;
}
