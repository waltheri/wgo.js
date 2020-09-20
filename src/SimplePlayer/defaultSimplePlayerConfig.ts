import { defaultBoardBaseTheme } from '../BoardBase/defaultConfig';
import { BoardBaseTheme } from '../BoardBase/types';
import { SVGDrawHandler } from '../SVGBoard/types';
import { Circle, Label, SimpleStone } from '../SVGBoard/svgDrawHandlers';
import Component, { ComponentConstructor } from './components/Component';
import SVGMarkupDrawHandler from '../SVGBoard/svgDrawHandlers/SVGMarkupDrawHandler';
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
  boardTheme: BoardBaseTheme;
  highlightCurrentMove: boolean;
  currentMoveBlackMark: SVGDrawHandler;
  currentMoveWhiteMark: SVGDrawHandler;
  enableMouseWheel: boolean;
  enableKeys: boolean;
  showVariations: boolean;
  showCurrentVariations: boolean;
  variationDrawHandler: SVGDrawHandler;
  formatNicks: boolean;
  formatMoves: boolean;
  components: { [key: string]: ComponentDeclaration<any> };
  layout: LayoutItem[];
}

const defaultSimplePlayerConfig: SimplePlayerConfig = {
  boardTheme: defaultBoardBaseTheme,
  highlightCurrentMove: true,
  currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)', fillColor:'rgba(0,0,0,0)' }),
  currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)', fillColor:'rgba(0,0,0,0)' }),
  enableMouseWheel: true,
  enableKeys: true,
  showVariations: true,
  showCurrentVariations: false,
  variationDrawHandler: new Label({ color: '#33f' }),
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
