import Component from './Component';
import { LifeCycleEvent } from '../../PlayerBase/types';
import SimplePlayer from '../SimplePlayer';
export default class CommentBox extends Component {
    element: HTMLElement;
    commentsElement: HTMLElement;
    constructor(player: SimplePlayer);
    create(): HTMLElement;
    destroy(): void;
    setComments(event: LifeCycleEvent<string>): void;
    clearComments(): void;
    formatComment(text: string): string;
}
