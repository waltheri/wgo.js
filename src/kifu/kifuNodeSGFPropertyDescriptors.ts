import { SGFPropertiesBag, SGFPropertyDescriptors } from '../sgf';
import { Color } from '../types';
import { KifuNode, MarkupType } from './KifuNode';

export const kifuNodeSGFPropertyDescriptors: SGFPropertyDescriptors<KifuNode> = {
  B: KifuNode.createMoveDescriptor(Color.Black),
  W: KifuNode.createMoveDescriptor(Color.White),
  AB: KifuNode.createSetupDescriptor(Color.Black),
  AW: KifuNode.createSetupDescriptor(Color.White),
  AE: KifuNode.createSetupDescriptor(Color.Empty),
  PL: {
    set(node, [value]) {
      if (!value) {
        node.player = undefined;
        return;
      }
      node.player = value.toUpperCase() === 'W' ? Color.White : Color.Black;
    },
    get(node) {
      if (node.player) {
        return [node.player === Color.White ? 'W' : 'B'];
      }
    },
  },
  VW: {
    set(node, [value]) {
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
    set(node, [value]) {
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
    set(node, [value]) {
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
    set(node, [value]) {
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
    set(node, [value]) {
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
    set(node, [value]) {
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
  CR: KifuNode.createPointMarkupDescriptor(MarkupType.Circle),
  DD: KifuNode.createPointMarkupDescriptor(MarkupType.Dim),
  MA: KifuNode.createPointMarkupDescriptor(MarkupType.XMark),
  SL: KifuNode.createPointMarkupDescriptor(MarkupType.Selected),
  SQ: KifuNode.createPointMarkupDescriptor(MarkupType.Square),
  TR: KifuNode.createPointMarkupDescriptor(MarkupType.Triangle),
  AR: KifuNode.createLineMarkupDescriptor(MarkupType.Arrow),
  LN: KifuNode.createLineMarkupDescriptor(MarkupType.Line),
  LB: KifuNode.createLabelMarkupDescriptor(MarkupType.Label),
};
