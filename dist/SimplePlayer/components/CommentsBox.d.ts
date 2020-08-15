import Component from './Component';
import { LifeCycleEvent } from '../../PlayerBase/types';
import SimplePlayer from '../SimplePlayer';
export default class CommentBox extends Component {
    player: SimplePlayer;
    element: HTMLElement;
    commentsElement: HTMLElement;
    constructor();
    create(player: SimplePlayer): HTMLElement;
    destroy(): void;
    setComments(event: LifeCycleEvent<string>): void;
    clearComments(): void;
    formatComment(text: string): string;
}
