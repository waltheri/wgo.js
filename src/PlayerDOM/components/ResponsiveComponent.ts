import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';

interface ResponsiveComponentParams {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'portrait' | 'landscape';
}

export default class ResponsiveComponent implements PlayerDOMComponent {
  private player: PlayerDOM;
  private element: Node;
  private visible: boolean = false;

  constructor(private params: ResponsiveComponentParams, private component: PlayerDOMComponent) {
    this.didMount = this.didMount.bind(this);
  }

  create(player: PlayerDOM): Node {
    this.player = player;
    this.element = this.createPlaceholder();

    this.player.on('resize', this.didMount);

    return this.element;
  }

  didMount() {
    const shouldRenderComponent = this.shouldRenderComponent();

    if (this.visible && !shouldRenderComponent) {
      // replace component element by placeholder
      const placeholder = this.createPlaceholder();
      this.element.parentElement.replaceChild(placeholder, this.element);
      this.element = placeholder;

      // clear component
      if (typeof this.component.destroy === 'function') {
        this.component.destroy();
      }

      this.visible = false;
    } else if (!this.visible && shouldRenderComponent) {
      // replaces placeholder by component element
      const componentElement = this.component.create(this.player);
      this.element.parentElement.replaceChild(componentElement, this.element);
      this.element = componentElement;

      // mount component logic if any
      if (typeof this.component.didMount === 'function') {
        this.component.didMount();
      }

      this.visible = true;
    }
  }

  destroy() {
    this.player.off('resize', this.didMount);

    if (typeof this.component.destroy === 'function') {
      this.component.destroy();
    }
  }

  private shouldRenderComponent() {
    const width = this.element.parentElement.offsetWidth;
    const height = this.element.parentElement.offsetHeight;

    if (this.params.minWidth != null && this.params.minWidth > width) {
      return false;
    }

    if (this.params.minHeight != null && this.params.minHeight > height) {
      return false;
    }

    if (this.params.maxWidth != null && this.params.maxWidth < width) {
      return false;
    }

    if (this.params.maxHeight != null && this.params.maxHeight < height) {
      return false;
    }

    if (this.params.orientation === 'portrait' && width < height) {
      return false;
    }

    return true;
  }

  private createPlaceholder() {
    // tslint:disable-next-line:max-line-length
    return document.createComment(` WGo component placeholder for ${this.component.constructor ? this.component.constructor.name : 'unknown'} ${JSON.stringify(this.params)} `);
  }
}
