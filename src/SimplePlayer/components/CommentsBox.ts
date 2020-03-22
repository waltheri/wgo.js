import Component from './Component';
import { LifeCycleEvent } from '../../PlayerBase/types';
import SimplePlayer from '../SimplePlayer';

export default class CommentBox extends Component {
  element: HTMLElement;
  commentsElement: HTMLElement;

  constructor(player: SimplePlayer) {
    super(player);

    this.setComments = this.setComments.bind(this);
    this.clearComments = this.clearComments.bind(this);
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'wgo-player__box wgo-player__box--content';

    const title = document.createElement('div');
    title.innerHTML = 'Comments';
    title.className = 'wgo-player__box__title';
    this.element.appendChild(title);

    this.commentsElement = document.createElement('div');
    this.commentsElement.className = 'wgo-player__box__content';
    this.element.appendChild(this.commentsElement);

    this.player.on('applyNodeChanges.C', this.setComments);
    this.player.on('clearNodeChanges.C', this.clearComments);

    return this.element;
  }

  destroy() {

  }

  setComments(event: LifeCycleEvent<string>) {
    this.commentsElement.innerHTML = this.formatComment(event.value);
  }

  clearComments() {
    this.commentsElement.textContent = '';
  }

  formatComment(text: string) {
    // remove HTML tags from text
    let formattedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // divide text into paragraphs
    formattedText = `<p>${formattedText.replace(/\n/g, '</p><p>')}</p>`;

    if (this.player.config.formatNicks) {
      formattedText = formattedText.replace(/(<p>)([^:]{3,}:)\s/g, '<p><span class="wgo-player__nick">$2</span> ');
    }

    if (this.player.config.formatMoves) {
      // tslint:disable-next-line:max-line-length
      formattedText = formattedText.replace(/\b[a-zA-Z]1?\d\b/g, '<a href="javascript:void(0)" class="wgo-player__move-link">$&</a>');
    }

    return formattedText;
  }
}
