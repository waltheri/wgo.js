import { SGFPropertiesBag, SGFPropertyDescriptors } from '../sgf';
import { Color } from '../types';
import KifuNode, { MarkupType, PointMarkup, LineMarkup, LabelMarkup } from './KifuNode';

export function createMoveDescriptor(color: Color.Black | Color.White) {
  return {
    set([value]: string[], node: KifuNode) {
      if (value) {
        node.move = {
          ...SGFPropertiesBag.parsePoint(value),
          c: color,
        };
      } else if (value === '') {
        node.move = { c: color };
      } else {
        node.move = undefined;
      }
    },
    get(node: KifuNode) {
      if (node.move && node.move.c === color) {
        return ['x' in node.move ? SGFPropertiesBag.pointToSGFValue(node.move) : ''];
      }
    },
  };
}

export function createSetupDescriptor(color: Color) {
  return {
    set(values: string[], node: KifuNode) {
      node.setup = node.setup.filter((s) => s.c !== color);
      values.forEach((value) => {
        node.addSetup(SGFPropertiesBag.parsePoint(value), color);
      });
    },
    get(node: KifuNode) {
      const blackStones = node.setup.filter((s) => s.c === color);
      return blackStones.map((bs) => SGFPropertiesBag.pointToSGFValue(bs));
    },
  };
}

export function createPointMarkupDescriptor(type: PointMarkup['type']) {
  return {
    set(values: string[], node: KifuNode) {
      node.markup = node.markup.filter((m) => m.type !== type);
      values.forEach((value) => {
        node.addMarkup({
          type,
          ...SGFPropertiesBag.parsePoint(value),
        });
      });
    },
    get(node: KifuNode) {
      const markup = node.markup.filter((m) => m.type === type) as PointMarkup[];
      return markup.map((m) => SGFPropertiesBag.pointToSGFValue(m));
    },
  };
}

export function createLineMarkupDescriptor(type: LineMarkup['type']) {
  return {
    set(values: string[], node: KifuNode) {
      node.markup = node.markup.filter((m) => m.type !== type);
      values.forEach((value) => {
        node.addMarkup({
          type,
          ...SGFPropertiesBag.parseVector(value),
        });
      });
    },
    get(node: KifuNode) {
      const lineMarkup = node.markup.filter((m) => m.type === type) as LineMarkup[];
      return lineMarkup.map((m) => SGFPropertiesBag.vectorToSGFValue(m));
    },
  };
}

export function createLabelMarkupDescriptor(type: LabelMarkup['type']) {
  return {
    set(values: string[], node: KifuNode) {
      node.markup = node.markup.filter((m) => m.type !== type);
      values.forEach((value) => {
        node.addMarkup({
          type,
          text: value.substring(3),
          ...SGFPropertiesBag.parsePoint(value),
        });
      });
    },
    get(node: KifuNode) {
      const labelMarkup = node.markup.filter((m) => m.type === type) as LabelMarkup[];
      return labelMarkup.map((m) => `${SGFPropertiesBag.pointToSGFValue(m)}:${m.text}`);
    },
  };
}

const kifuNodeSGFPropertyDescriptors: SGFPropertyDescriptors<KifuNode> = {
  B: createMoveDescriptor(Color.Black),
  W: createMoveDescriptor(Color.White),
  AB: createSetupDescriptor(Color.Black),
  AW: createSetupDescriptor(Color.White),
  AE: createSetupDescriptor(Color.Empty),
  PL: {
    set([value], node) {
      if (!value) {
        node.turn = undefined;
        return;
      }
      node.turn = value.toUpperCase() === 'W' ? Color.White : Color.Black;
    },
    get(node) {
      if (node.turn) {
        return [node.turn === Color.White ? 'W' : 'B'];
      }
    },
  },
  VW: {
    set([value], node) {
      if (!value) {
        node.boardSection = undefined;
        return;
      }
      node.boardSection = SGFPropertiesBag.parseVector(value);
    },
    get(node) {
      if (node.boardSection) {
        return [SGFPropertiesBag.vectorToSGFValue(node.boardSection)];
      }
    },
  },
  BL: {
    set([value], node) {
      if (!value) {
        node.blackTimeLeft = undefined;
        return;
      }
      node.blackTimeLeft = parseFloat(value);
    },
    get(node) {
      if (node.blackTimeLeft) {
        return [String(node.blackTimeLeft)];
      }
    },
  },
  OB: {
    set([value], node) {
      if (!value) {
        node.blackStonesLeft = undefined;
        return;
      }
      node.blackStonesLeft = parseInt(value, 10);
    },
    get(node) {
      if (node.blackStonesLeft) {
        return [String(node.blackStonesLeft)];
      }
    },
  },
  WL: {
    set([value], node) {
      if (!value) {
        node.whiteTimeLeft = undefined;
        return;
      }
      node.whiteTimeLeft = parseFloat(value);
    },
    get(node) {
      if (node.whiteTimeLeft) {
        return [String(node.whiteTimeLeft)];
      }
    },
  },
  OW: {
    set([value], node) {
      if (!value) {
        node.whiteStonesLeft = undefined;
        return;
      }
      node.whiteStonesLeft = parseInt(value, 10);
    },
    get(node) {
      if (node.whiteStonesLeft) {
        return [String(node.whiteStonesLeft)];
      }
    },
  },
  C: {
    set([value], node) {
      if (!value) {
        node.comment = undefined;
        return;
      }
      node.comment = value;
    },
    get(node) {
      if (node.comment) {
        return [node.comment];
      }
    },
  },
  CR: createPointMarkupDescriptor(MarkupType.Circle),
  DD: createPointMarkupDescriptor(MarkupType.Dim),
  MA: createPointMarkupDescriptor(MarkupType.XMark),
  SL: createPointMarkupDescriptor(MarkupType.Selected),
  SQ: createPointMarkupDescriptor(MarkupType.Square),
  TR: createPointMarkupDescriptor(MarkupType.Triangle),
  AR: createLineMarkupDescriptor(MarkupType.Arrow),
  LN: createLineMarkupDescriptor(MarkupType.Line),
  LB: createLabelMarkupDescriptor(MarkupType.Label),
};

export default kifuNodeSGFPropertyDescriptors;
