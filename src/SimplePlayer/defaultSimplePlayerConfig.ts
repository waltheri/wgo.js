import { ComponentConstructor } from './components/Component';
import { CommentBox, ContainerCondition, ControlPanel, GameInfoBox, PlayerTag, SVGBoardComponent } from './components';
import { Color } from '../types';

export interface SimplePlayerBoardConfig {

}

export interface ComponentDeclaration<T> {
  component: ComponentConstructor<T>;
  config?: T;
}

export interface Condition {
  (container: any): boolean;
}

export interface ConditionalItem {
  if?: Condition;
}

export interface ConditionalComponent extends ConditionalItem {
  component: string;
}

export type LayoutItem = ColumnStack | RowStack | ComponentPlaceholder;

export interface ColumnStack extends ConditionalItem {
  column: LayoutItem[];
}

export interface RowStack extends ConditionalItem {
  row: LayoutItem[];
}

export type ComponentPlaceholder = string | ConditionalComponent;

export interface SimplePlayerConfig {
  highlightCurrentMove: boolean;
  enableMouseWheel: boolean;
  enableKeys: boolean;
  showVariations: boolean;
  showCurrentVariations: boolean;
  formatNicks: boolean;
  formatMoves: boolean;
  components: { [key: string]: ComponentDeclaration<any> };
  layout: LayoutItem[];
}

const defaultSimplePlayerConfig: SimplePlayerConfig = {
  highlightCurrentMove: true,
  enableMouseWheel: true,
  enableKeys: true,
  showVariations: true,
  showCurrentVariations: false,
  formatNicks: true,
  formatMoves: true,
  components: {
    board: {
      component: SVGBoardComponent,
    },
    playerBlack: {
      component: PlayerTag,
      config: Color.B,
    },
    playerWhite: {
      component: PlayerTag,
      config: Color.W,
    },
    controlPanel: {
      component: ControlPanel,
    },
    gameInfoBox: {
      component: GameInfoBox,
    },
    commentBox: {
      component: CommentBox,
    },
  },
  layout: [{
    column: [
      {
        if: ContainerCondition.maxWidth(749),
        row: ['playerBlack', 'playerWhite'],
      },
      {
        row: [
          'board',
          {
            if: ContainerCondition.minWidth(650),
            column: [
              { if: ContainerCondition.minWidth(250), component: 'playerBlack' },
              { if: ContainerCondition.minWidth(250), component: 'playerWhite' },
              { if: ContainerCondition.minWidth(250), component: 'controlPanel' },
              'gameInfoBox',
              'commentBox',
            ],
          },
        ],
      },
      { if: ContainerCondition.maxWidth(749), component: 'controlPanel' },
      { if: ContainerCondition.maxWidth(649), component: 'commentBox' },
    ],
  }],
};

export default defaultSimplePlayerConfig;
