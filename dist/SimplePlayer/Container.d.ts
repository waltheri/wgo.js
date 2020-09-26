import SimplePlayer from '../SimplePlayer';
import { LayoutItem } from './defaultSimplePlayerConfig';
export interface Condition {
    (container: Container): boolean;
}
export default class Container {
    player: SimplePlayer;
    items: LayoutItem[];
    element: HTMLElement;
    constructor(player: SimplePlayer, items: LayoutItem[]);
    create(wrapper: HTMLElement): void;
}
