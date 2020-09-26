import { LayoutItem } from '../defaultSimplePlayerConfig';
import SimplePlayer from '../SimplePlayer';
import Container from './Container';

/**
 * Encapsulate main/root HTML element of the player. It is special kind of Container which
 * register root mouse and key events for player control. This component is directly used
 * by SimplePlayer and shouldn't be used manually.
 */
export default class PlayerWrapper extends Container {
  constructor(player: SimplePlayer, items: LayoutItem[] = player.config.layout) {
    super(player, items, '');

    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'wgo-player';
    this.element.tabIndex = 1;

    document.addEventListener('mousewheel', this.handleMouseWheel);
    document.addEventListener('keydown', this.handleKeydown);

    this.player.on('resize', this.handleResize);

    return this.element;
  }

  destroy() {
    super.destroy();

    document.removeEventListener('mousewheel', this.handleMouseWheel);
    document.removeEventListener('keydown', this.handleKeydown);

    this.player.off('resize', this.handleResize);
  }

  private handleMouseWheel(e: any) {
    if (document.activeElement === this.element && this.player.config.enableMouseWheel) {
      if (e.deltaY > 0) {
        this.player.next();
      } else if (e.deltaY < 0) {
        this.player.previous();
      }

      return false;
    }
  }

  private handleKeydown(e: any) {
    if (document.activeElement === this.element && this.player.config.enableKeys) {
      if (e.key === 'ArrowRight') {
        this.player.next();
      } else if (e.key === 'ArrowLeft') {
        this.player.previous();
      }

      return false;
    }
  }

  private handleResize() {
    this.didMount();
  }
}
