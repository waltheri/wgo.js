import { PartialRecursive } from '../../utils/makeConfig';
import SimplePlayer from '../SimplePlayer';
export default interface Extension<T> {
    config: T;
    create?(): void;
    destroy?(): void;
}
export interface ExtensionConstructor<T> {
    new (player: SimplePlayer, config: PartialRecursive<T>): Extension<T>;
}
