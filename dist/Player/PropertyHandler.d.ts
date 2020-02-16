import PlayerBase from './PlayerBase';
export default abstract class PropertyHandler<V, D = void> {
    beforeInit?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    applyGameChanges?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    applyNodeChanges?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    clearGameChanges?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
    clearNodeChanges?(valueOrValues: V, player: PlayerBase, propertyData: D): D;
}
