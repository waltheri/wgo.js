import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Color } from '../types';
import PlayerDOM, { PlayerDOMConfig, playerDOMDefaultConfig } from '../PlayerDOM/PlayerDOM';
import SVGBoardComponent, {
  defaultSVGBoardComponentConfig,
  SVGBoardComponentConfig,
} from '../PlayerDOM/components/SVGBoardComponent';
import CommentsBox, { CommentBoxConfig, commentBoxDefaultConfig } from '../PlayerDOM/components/CommentsBox';
import GameInfoBox, { GameInfoBoxConfig, gameInfoBoxDefaultConfig } from '../PlayerDOM/components/GameInfoBox';
import { EditMode } from '../PlayerBase/plugins';
import { Container, ControlPanel, PlayerTag, ResponsiveComponent } from '../PlayerDOM/components';
import KifuNode from '../kifu/KifuNode';

interface SimplePlayerConfig extends PlayerDOMConfig {
  board: SVGBoardComponentConfig;
  comments: CommentBoxConfig & {
    enabled: boolean;
  };
  gameInfo: GameInfoBoxConfig & {
    enabled: boolean;
  };
  sgfFile: string | null;
  sgf: string | null;
}

const defaultConfig: SimplePlayerConfig = {
  ...playerDOMDefaultConfig,
  board: defaultSVGBoardComponentConfig,
  comments: {
    enabled: true,
    ...commentBoxDefaultConfig,
  },
  gameInfo: {
    enabled: true,
    ...gameInfoBoxDefaultConfig,
  },
  sgfFile: null,
  sgf: null,
};

export default class SimplePlayer extends PlayerDOM {
  element: HTMLElement;
  config: SimplePlayerConfig;

  constructor(elem: HTMLElement, config: PartialRecursive<SimplePlayerConfig> = {}) {
    super();

    // TODO - already partially done in PlayerDOM
    this.config = makeConfig(defaultConfig, config);

    this.element = elem;
    this.init();
  }

  init() {
    const editMode = new EditMode();
    this.use(editMode);

    const svgBoardComponent = new SVGBoardComponent(this.config.board);

    const controlPanelConfig = {
      menuItems: [
        ControlPanel.menuItems.editMode(editMode),
        ControlPanel.menuItems.displayCoordinates(svgBoardComponent),
        ControlPanel.menuItems.download(this),
      ],
    };

    const component = new Container('column', [
      new ResponsiveComponent({ maxWidth: 749 }, new Container('row', [
        new PlayerTag(Color.B),
        new PlayerTag(Color.W),
      ])),
      new Container('row', [
        svgBoardComponent,
        new ResponsiveComponent({ minWidth: 650 }, new Container('column', [
          new ResponsiveComponent({ minWidth: 250 }, new PlayerTag(Color.B)),
          new ResponsiveComponent({ minWidth: 250 }, new PlayerTag(Color.W)),
          new ResponsiveComponent({ minWidth: 250 }, new ControlPanel(controlPanelConfig)),
          new GameInfoBox(this.config.gameInfo),
          new CommentsBox(this.config.comments),
        ])),
      ]),
      new ResponsiveComponent({ maxWidth: 749 }, new ControlPanel(controlPanelConfig)),
      new ResponsiveComponent({ maxWidth: 649 }, new CommentsBox(this.config.comments)),
    ]);

    this.render(component, this.element);

    if (this.config.sgf) {
      this.loadKifu(KifuNode.fromSGF(this.config.sgf));
    } else if (this.config.sgfFile) {
      // TODO add some loading overlay and error state
      fetch(this.config.sgfFile).then(
        response => response.text(),
      ).then(
        value => this.loadKifu(KifuNode.fromSGF(value)),
      );
    }
  }
}
