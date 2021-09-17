import { MarkupBoardObject } from '../../BoardBase';
import makeConfig, { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';

export interface CommentBoxConfig {
  formatMoves: boolean;
  formatNicks: boolean;
}

export const commentBoxDefaultConfig = {
  formatMoves: true,
  formatNicks: true,
};

export default class CommentsBox implements PlayerDOMComponent {
  element: HTMLElement;
  commentsElement: HTMLElement;
  player: PlayerDOM;
  config: CommentBoxConfig;

  constructor(config: PartialRecursive<CommentBoxConfig> = {}) {
    this.config = makeConfig(commentBoxDefaultConfig, config);
    this.setComments = this.setComments.bind(this);
    this.clearComments = this.clearComments.bind(this);

    // create HTML
    this.element = document.createElement('div');
    this.element.className = 'wgo-player__box wgo-player__box--content';

    const title = document.createElement('div');
    title.innerHTML = 'Comments';
    title.className = 'wgo-player__box__title';
    this.element.appendChild(title);

    this.commentsElement = document.createElement('div');
    this.commentsElement.className = 'wgo-player__box__content';
    this.element.appendChild(this.commentsElement);
  }

  create(player: PlayerDOM) {
    this.player = player;

    this.player.on('applyNodeChanges.C', this.setComments);
    this.player.on('clearNodeChanges.C', this.clearComments);

    if (this.player.currentNode) {
      const comment = this.player.currentNode.getProperty('C');
      if (comment) {
        this.setComments({ value: comment });
      }
    }
  }

  destroy() {
    this.player.off('applyNodeChanges.C', this.setComments);
    this.player.off('clearNodeChanges.C', this.clearComments);
    this.player = null;
  }

  setComments(event: { value: string }) {
    this.commentsElement.innerHTML = this.formatComment(event.value);

    if (this.config.formatMoves) {
      [].forEach.call(this.commentsElement.querySelectorAll('.wgo-player__move-link'), (link: HTMLElement) => {
        const point = coordinatesToPoint(link.textContent, this.player.game.sizeX, this.player.game.sizeY);
        const boardObject = new MarkupBoardObject('MA', point.x, point.y, this.player.game.getStone(point.x, point.y));
        boardObject.zIndex = 20;

        link.addEventListener('mouseenter', () => {
          this.player.emit('board.addTemporaryObject', boardObject);
        });

        link.addEventListener('mouseleave', () => {
          this.player.emit('board.removeTemporaryObject', boardObject);
        });
      });
    }
  }

  clearComments() {
    this.commentsElement.textContent = '';
  }

  formatComment(text: string) {
    // remove HTML tags from text
    let formattedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // divide text into paragraphs
    formattedText = `<p>${formattedText.replace(/\n/g, '</p><p>')}</p>`;

    if (this.config.formatNicks) {
      formattedText = formattedText.replace(/(<p>)([^:]{3,}:)\s/g, '<p><span class="wgo-player__nick">$2</span> ');
    }

    if (this.config.formatMoves) {
      // tslint:disable-next-line:max-line-length
      formattedText = formattedText.replace(/\b[a-zA-Z]1?\d\b/g, '<a href="javascript:void(0)" class="wgo-player__move-link">$&</a>');
    }

    return formattedText;
  }
}

function coordinatesToPoint(coordinates: string, boardSizeX: number, boardSizeY: number) {
  const x = coordinates.toLowerCase().charCodeAt(0) - 97; // char code of "a"
  const y = parseInt(coordinates.substr(1), 10) - 1;
  return { x, y: boardSizeY - 1 - y };
}
