import { SGFPropertyDescriptors } from '../sgf';
import KifuInfo from './KifuInfo';

const kifuInfoSGFPropertyDescriptors: SGFPropertyDescriptors<KifuInfo> = {
  SZ: {
    set([value], info) {
      if (!value) {
        info.boardSize = undefined;
        return;
      }
      const sizes = value.split(':');
      info.boardSize = sizes[1]
        ? { cols: parseInt(sizes[0]), rows: parseInt(sizes[1]) }
        : Number(sizes[0]);
    },
    get(info) {
      if (info.boardSize) {
        if (typeof info.boardSize === 'number') {
          return [String(info.boardSize)];
        } else {
          return [`${info.boardSize.cols}:${info.boardSize.rows}`];
        }
      }
    },
  },
  HA: {
    set([value], info) {
      if (!value) {
        info.handicap = undefined;
        return;
      }
      info.handicap = parseInt(value);
    },
    get(info) {
      if (info.handicap) {
        return [String(info.handicap)];
      }
    },
  },
  KM: {
    set([value], info) {
      if (!value) {
        info.komi = undefined;
        return;
      }
      info.komi = parseFloat(value);
    },
    get(info) {
      if (info.komi) {
        return [String(info.komi)];
      }
    },
  },
  ST: {
    set([value], info) {
      if (!value) {
        info.variationsStyle = undefined;
        return;
      }
      const val = parseInt(value);

      info.variationsStyle = {
        currentNode: !!(val & 1),
        noMarkup: !!(val & 2),
      };
    },
    get(info) {
      if (info.variationsStyle) {
        return [
          String(
            Number(info.variationsStyle.currentNode) + Number(info.variationsStyle.noMarkup) * 2,
          ),
        ];
      }
    },
  },
  PB: {
    set([value], info) {
      if (!value) {
        info.blackName = undefined;
        return;
      }
      info.blackName = value;
    },
    get(info) {
      if (info.blackName) {
        return [info.blackName];
      }
    },
  },
  BR: {
    set([value], info) {
      if (!value) {
        info.blackRank = undefined;
        return;
      }
      info.blackRank = value;
    },
    get(info) {
      if (info.blackRank) {
        return [info.blackRank];
      }
    },
  },
  BT: {
    set([value], info) {
      if (!value) {
        info.blackTeam = undefined;
        return;
      }
      info.blackTeam = value;
    },
    get(info) {
      if (info.blackTeam) {
        return [info.blackTeam];
      }
    },
  },
  PW: {
    set([value], info) {
      if (!value) {
        info.whiteName = undefined;
        return;
      }
      info.whiteName = value;
    },
    get(info) {
      if (info.whiteName) {
        return [info.whiteName];
      }
    },
  },
  WR: {
    set([value], info) {
      if (!value) {
        info.whiteRank = undefined;
        return;
      }
      info.whiteRank = value;
    },
    get(info) {
      if (info.whiteRank) {
        return [info.whiteRank];
      }
    },
  },
  WT: {
    set([value], info) {
      if (!value) {
        info.whiteTeam = undefined;
        return;
      }
      info.whiteTeam = value;
    },
    get(info) {
      if (info.whiteTeam) {
        return [info.whiteTeam];
      }
    },
  },
  GN: {
    set([value], info) {
      if (!value) {
        info.gameName = undefined;
        return;
      }
      info.gameName = value;
    },
    get(info) {
      if (info.gameName) {
        return [info.gameName];
      }
    },
  },
  GC: {
    set([value], info) {
      if (!value) {
        info.gameComment = undefined;
        return;
      }
      info.gameComment = value;
    },
    get(info) {
      if (info.gameComment) {
        return [info.gameComment];
      }
    },
  },
  DT: {
    set([value], info) {
      if (!value) {
        info.date = undefined;
        return;
      }
      info.date = value;
    },
    get(info) {
      if (info.date) {
        return [info.date];
      }
    },
  },
  EV: {
    set([value], info) {
      if (!value) {
        info.event = undefined;
        return;
      }
      info.event = value;
    },
    get(info) {
      if (info.event) {
        return [info.event];
      }
    },
  },
  PC: {
    set([value], info) {
      if (!value) {
        info.place = undefined;
        return;
      }
      info.place = value;
    },
    get(info) {
      if (info.place) {
        return [info.place];
      }
    },
  },
  RO: {
    set([value], info) {
      if (!value) {
        info.round = undefined;
        return;
      }
      info.round = value;
    },
    get(info) {
      if (info.round) {
        return [info.round];
      }
    },
  },
  RE: {
    set([value], info) {
      if (!value) {
        info.result = undefined;
        return;
      }
      info.result = value as any;
    },
    get(info) {
      if (info.result) {
        return [info.result];
      }
    },
  },
  TM: {
    set([value], info) {
      if (!value) {
        info.timeLimits = undefined;
        return;
      }
      info.timeLimits = parseInt(value);
    },
    get(info) {
      if (info.timeLimits) {
        return [String(info.timeLimits)];
      }
    },
  },
  OT: {
    set([value], info) {
      if (!value) {
        info.overTime = undefined;
        return;
      }
      info.overTime = value;
    },
    get(info) {
      if (info.overTime) {
        return [info.overTime];
      }
    },
  },
  RU: {
    set([value], info) {
      if (!value) {
        info.rules = undefined;
        return;
      }
      info.rules = value;
    },
    get(info) {
      if (info.rules) {
        return [info.rules];
      }
    },
  },
  SO: {
    set([value], info) {
      if (!value) {
        info.source = undefined;
        return;
      }
      info.source = value;
    },
    get(info) {
      if (info.source) {
        return [info.source];
      }
    },
  },
  US: {
    set([value], info) {
      if (!value) {
        info.author = undefined;
        return;
      }
      info.author = value;
    },
    get(info) {
      if (info.author) {
        return [info.author];
      }
    },
  },
  AN: {
    set([value], info) {
      if (!value) {
        info.annotator = undefined;
        return;
      }
      info.annotator = value;
    },
    get(info) {
      if (info.annotator) {
        return [info.annotator];
      }
    },
  },
  CP: {
    set([value], info) {
      if (!value) {
        info.copyright = undefined;
        return;
      }
      info.copyright = value;
    },
    get(info) {
      if (info.copyright) {
        return [info.copyright];
      }
    },
  },
};

export default kifuInfoSGFPropertyDescriptors;
