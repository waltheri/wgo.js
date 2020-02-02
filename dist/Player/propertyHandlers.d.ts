import { Player } from '..';
export interface PropertyHandler {
    (player: Player, propIdent: string, propValue: any): void;
}
declare const propertyHandlers: {
    [propIdent: string]: PropertyHandler;
};
export default propertyHandlers;
