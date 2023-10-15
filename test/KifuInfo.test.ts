import { strictEqual, deepEqual, ok } from 'assert';
import { kifuInfoSGFPropertyDescriptors } from '../src/kifu/kifuInfoSGFPropertyDescriptors';
import { KifuInfo } from '../src/kifu';
import { PropIdent } from '../src/sgf';

describe('KifuInfo', () => {
  describe('Correct transformation from SGF property values.', () => {
    let tests = 0;

    it('Property SZ', () => {
      tests++;
      const info = KifuInfo.fromSGF('SZ[19]');
      strictEqual(info.boardSize, 19);

      const info2 = KifuInfo.fromSGF('SZ[9:13]');
      deepEqual(info2.boardSize, { cols: 9, rows: 13 });
    });

    it('Property HA', () => {
      tests++;
      const info = KifuInfo.fromSGF('HA[2]');
      strictEqual(info.handicap, 2);
    });

    it('Property KM', () => {
      tests++;
      const info = KifuInfo.fromSGF('KM[5.5]');
      strictEqual(info.komi, 5.5);
    });

    it('Property ST', () => {
      tests++;
      const info = KifuInfo.fromSGF('ST[1]');
      deepEqual(info.variationsStyle, { currentNode: true, noMarkup: false });

      const info2 = KifuInfo.fromSGF('ST[2]');
      deepEqual(info2.variationsStyle, { currentNode: false, noMarkup: true });

      const info3 = KifuInfo.fromSGF('ST[3]');
      deepEqual(info3.variationsStyle, { currentNode: true, noMarkup: true });
    });

    it('Property PB', () => {
      tests++;
      const info = KifuInfo.fromSGF('PB[John Doe]');
      strictEqual(info.blackName, 'John Doe');
    });

    it('Property BR', () => {
      tests++;
      const info = KifuInfo.fromSGF('BR[1d]');
      strictEqual(info.blackRank, '1d');
    });

    it('Property BT', () => {
      tests++;
      const info = KifuInfo.fromSGF('BT[Team Black]');
      strictEqual(info.blackTeam, 'Team Black');
    });

    it('Property PW', () => {
      tests++;
      const info = KifuInfo.fromSGF('PW[Jane Doe]');
      strictEqual(info.whiteName, 'Jane Doe');
    });

    it('Property WR', () => {
      tests++;
      const info = KifuInfo.fromSGF('WR[2d]');
      strictEqual(info.whiteRank, '2d');
    });

    it('Property WT', () => {
      tests++;
      const info = KifuInfo.fromSGF('WT[Team White]');
      strictEqual(info.whiteTeam, 'Team White');
    });

    it('Property GN', () => {
      tests++;
      const info = KifuInfo.fromSGF('GN[Game Name]');
      strictEqual(info.gameName, 'Game Name');
    });

    it('Property GC', () => {
      tests++;
      const info = KifuInfo.fromSGF('GC[Game Comment]');
      strictEqual(info.gameComment, 'Game Comment');
    });

    it('Property DT', () => {
      tests++;
      const info = KifuInfo.fromSGF('DT[2020-01-01]');
      strictEqual(info.date, '2020-01-01');
    });

    it('Property EV', () => {
      tests++;
      const info = KifuInfo.fromSGF('EV[Event]');
      strictEqual(info.event, 'Event');
    });

    it('Property PC', () => {
      tests++;
      const info = KifuInfo.fromSGF('PC[Place]');
      strictEqual(info.place, 'Place');
    });

    it('Property RO', () => {
      tests++;
      const info = KifuInfo.fromSGF('RO[Round]');
      strictEqual(info.round, 'Round');
    });

    it('Property RE', () => {
      tests++;
      const info = KifuInfo.fromSGF('RE[B+R]');
      strictEqual(info.result, 'B+R');
    });

    it('Property TM', () => {
      tests++;
      const info = KifuInfo.fromSGF('TM[600]');
      strictEqual(info.timeLimits, 600);
    });

    it('Property OT', () => {
      tests++;
      const info = KifuInfo.fromSGF('OT[5x30 byo-yomi]');
      strictEqual(info.overTime, '5x30 byo-yomi');
    });

    it('Property RU', () => {
      tests++;
      const info = KifuInfo.fromSGF('RU[Japanese]');
      strictEqual(info.rules, 'Japanese');
    });

    it('Property SO', () => {
      tests++;
      const info = KifuInfo.fromSGF('SO[Source]');
      strictEqual(info.source, 'Source');
    });

    it('Property US', () => {
      tests++;
      const info = KifuInfo.fromSGF('US[User]');
      strictEqual(info.author, 'User');
    });

    it('Property AN', () => {
      tests++;
      const info = KifuInfo.fromSGF('AN[Annotation]');
      strictEqual(info.annotator, 'Annotation');
    });

    it('Property CP', () => {
      tests++;
      const info = KifuInfo.fromSGF('CP[copyright]');
      strictEqual(info.copyright, 'copyright');
    });

    it('Test of all property types', () => {
      strictEqual(tests, Object.keys(kifuInfoSGFPropertyDescriptors).length);
    });

    it('Unknown property', () => {
      const info = KifuInfo.fromSGF('XX[test][test2]');
      deepEqual(info.properties.XX, ['test', 'test2']);
    });
  });

  describe('Correct clear of SGF property values.', () => {
    let tests = 0;

    it('Property SZ', () => {
      tests++;
      const info = KifuInfo.fromSGF('SZ[19]');
      info.setSGFProperty(PropIdent.BoardSize, []);
      strictEqual(info.boardSize, undefined);
    });

    it('Property HA', () => {
      tests++;
      const info = KifuInfo.fromSGF('HA[2]');
      info.setSGFProperty(PropIdent.Handicap, []);
      strictEqual(info.handicap, undefined);
    });

    it('Property KM', () => {
      tests++;
      const info = KifuInfo.fromSGF('KM[5.5]');
      info.setSGFProperty(PropIdent.Komi, []);
      strictEqual(info.komi, undefined);
    });

    it('Property ST', () => {
      tests++;
      const info = KifuInfo.fromSGF('ST[1]');
      info.setSGFProperty(PropIdent.VariationsStyle, []);
      strictEqual(info.variationsStyle, undefined);
    });

    it('Property PB', () => {
      tests++;
      const info = KifuInfo.fromSGF('PB[John Doe]');
      info.setSGFProperty(PropIdent.BlackName, []);
      strictEqual(info.blackName, undefined);
    });

    it('Property BR', () => {
      tests++;
      const info = KifuInfo.fromSGF('BR[1d]');
      info.setSGFProperty(PropIdent.BlackRank, []);
      strictEqual(info.blackRank, undefined);
    });

    it('Property BT', () => {
      tests++;
      const info = KifuInfo.fromSGF('BT[Team Black]');
      info.setSGFProperty(PropIdent.BlackTeam, []);
      strictEqual(info.blackTeam, undefined);
    });

    it('Property PW', () => {
      tests++;
      const info = KifuInfo.fromSGF('PW[Jane Doe]');
      info.setSGFProperty(PropIdent.WhiteName, []);
      strictEqual(info.whiteName, undefined);
    });

    it('Property WR', () => {
      tests++;
      const info = KifuInfo.fromSGF('WR[2d]');
      info.setSGFProperty(PropIdent.WhiteRank, []);
      strictEqual(info.whiteRank, undefined);
    });

    it('Property WT', () => {
      tests++;
      const info = KifuInfo.fromSGF('WT[Team White]');
      info.setSGFProperty(PropIdent.WhiteTeam, []);
      strictEqual(info.whiteTeam, undefined);
    });

    it('Property GN', () => {
      tests++;
      const info = KifuInfo.fromSGF('GN[Game Name]');
      info.setSGFProperty(PropIdent.GameName, []);
      strictEqual(info.gameName, undefined);
    });

    it('Property GC', () => {
      tests++;
      const info = KifuInfo.fromSGF('GC[Game Comment]');
      info.setSGFProperty(PropIdent.GameComment, []);
      strictEqual(info.gameComment, undefined);
    });

    it('Property DT', () => {
      tests++;
      const info = KifuInfo.fromSGF('DT[2020-01-01]');
      info.setSGFProperty(PropIdent.Date, []);
      strictEqual(info.date, undefined);
    });

    it('Property EV', () => {
      tests++;
      const info = KifuInfo.fromSGF('EV[Event]');
      info.setSGFProperty(PropIdent.Event, []);
      strictEqual(info.event, undefined);
    });

    it('Property PC', () => {
      tests++;
      const info = KifuInfo.fromSGF('PC[Place]');
      info.setSGFProperty(PropIdent.Place, []);
      strictEqual(info.place, undefined);
    });

    it('Property RO', () => {
      tests++;
      const info = KifuInfo.fromSGF('RO[Round]');
      info.setSGFProperty(PropIdent.Round, []);
      strictEqual(info.round, undefined);
    });

    it('Property RE', () => {
      tests++;
      const info = KifuInfo.fromSGF('RE[B+R]');
      info.setSGFProperty(PropIdent.Result, []);
      strictEqual(info.result, undefined);
    });

    it('Property TM', () => {
      tests++;
      const info = KifuInfo.fromSGF('TM[600]');
      info.setSGFProperty(PropIdent.TimeLimits, []);
      strictEqual(info.timeLimits, undefined);
    });

    it('Property OT', () => {
      tests++;
      const info = KifuInfo.fromSGF('OT[5x30 byo-yomi]');
      info.setSGFProperty(PropIdent.OverTime, []);
      strictEqual(info.overTime, undefined);
    });

    it('Property RU', () => {
      tests++;
      const info = KifuInfo.fromSGF('RU[Japanese]');
      info.setSGFProperty(PropIdent.Rules, []);
      strictEqual(info.rules, undefined);
    });

    it('Property SO', () => {
      tests++;
      const info = KifuInfo.fromSGF('SO[Source]');
      info.setSGFProperty(PropIdent.Source, []);
      strictEqual(info.source, undefined);
    });

    it('Property US', () => {
      tests++;
      const info = KifuInfo.fromSGF('US[User]');
      info.setSGFProperty(PropIdent.Author, []);
      strictEqual(info.author, undefined);
    });

    it('Property AN', () => {
      tests++;
      const info = KifuInfo.fromSGF('AN[Annotation]');
      info.setSGFProperty(PropIdent.Annotator, []);
      strictEqual(info.annotator, undefined);
    });

    it('Property CP', () => {
      tests++;
      const info = KifuInfo.fromSGF('CP[copyright]');
      info.setSGFProperty(PropIdent.Copyright, []);
      strictEqual(info.copyright, undefined);
    });

    it('Test of all property types', () => {
      strictEqual(tests, Object.keys(kifuInfoSGFPropertyDescriptors).length);
    });

    it('Unknown property', () => {
      const info = KifuInfo.fromSGF('XX[test][test2]');
      deepEqual(info.properties.XX, ['test', 'test2']);
    });
  });

  describe('Correct transformation to SGF property values.', () => {
    let tests = 0;

    it('Property SZ', () => {
      tests++;
      const info = KifuInfo.fromJS({ boardSize: 19 });
      strictEqual(info.getSGFProperties(), 'SZ[19]');

      const info2 = KifuInfo.fromJS({ boardSize: { cols: 9, rows: 13 } });
      strictEqual(info2.getSGFProperties(), 'SZ[9:13]');
    });

    it('Property HA', () => {
      tests++;
      const info = KifuInfo.fromJS({ handicap: 2 });
      strictEqual(info.getSGFProperties(), 'HA[2]');
    });

    it('Property KM', () => {
      tests++;
      const info = KifuInfo.fromJS({ komi: 5.5 });
      strictEqual(info.getSGFProperties(), 'KM[5.5]');
    });

    it('Property ST', () => {
      tests++;
      const info = KifuInfo.fromJS({ variationsStyle: { currentNode: true, noMarkup: false } });
      strictEqual(info.getSGFProperties(), 'ST[1]');

      const info2 = KifuInfo.fromJS({ variationsStyle: { currentNode: false, noMarkup: true } });
      strictEqual(info2.getSGFProperties(), 'ST[2]');

      const info3 = KifuInfo.fromJS({ variationsStyle: { currentNode: true, noMarkup: true } });
      strictEqual(info3.getSGFProperties(), 'ST[3]');
    });

    it('Property PB', () => {
      tests++;
      const info = KifuInfo.fromJS({ blackName: 'John Doe' });
      strictEqual(info.getSGFProperties(), 'PB[John Doe]');
    });

    it('Property BR', () => {
      tests++;
      const info = KifuInfo.fromJS({ blackRank: '1d' });
      strictEqual(info.getSGFProperties(), 'BR[1d]');
    });

    it('Property BT', () => {
      tests++;
      const info = KifuInfo.fromJS({ blackTeam: 'Team Black' });
      strictEqual(info.getSGFProperties(), 'BT[Team Black]');
    });

    it('Property PW', () => {
      tests++;
      const info = KifuInfo.fromJS({ whiteName: 'Jane Doe' });
      strictEqual(info.getSGFProperties(), 'PW[Jane Doe]');
    });

    it('Property WR', () => {
      tests++;
      const info = KifuInfo.fromJS({ whiteRank: '2d' });
      strictEqual(info.getSGFProperties(), 'WR[2d]');
    });

    it('Property WT', () => {
      tests++;
      const info = KifuInfo.fromJS({ whiteTeam: 'Team White' });
      strictEqual(info.getSGFProperties(), 'WT[Team White]');
    });

    it('Property GN', () => {
      tests++;
      const info = KifuInfo.fromJS({ gameName: 'Game Name' });
      strictEqual(info.getSGFProperties(), 'GN[Game Name]');
    });

    it('Property GC', () => {
      tests++;
      const info = KifuInfo.fromJS({ gameComment: 'Game Comment' });
      strictEqual(info.getSGFProperties(), 'GC[Game Comment]');
    });

    it('Property DT', () => {
      tests++;
      const info = KifuInfo.fromJS({ date: '2020-01-01' });
      strictEqual(info.getSGFProperties(), 'DT[2020-01-01]');
    });

    it('Property EV', () => {
      tests++;
      const info = KifuInfo.fromJS({ event: 'Event' });
      strictEqual(info.getSGFProperties(), 'EV[Event]');
    });

    it('Property PC', () => {
      tests++;
      const info = KifuInfo.fromJS({ place: 'Place' });
      strictEqual(info.getSGFProperties(), 'PC[Place]');
    });

    it('Property RO', () => {
      tests++;
      const info = KifuInfo.fromJS({ round: 'Round' });
      strictEqual(info.getSGFProperties(), 'RO[Round]');
    });

    it('Property RE', () => {
      tests++;
      const info = KifuInfo.fromJS({ result: 'B+R' });
      strictEqual(info.getSGFProperties(), 'RE[B+R]');
    });

    it('Property TM', () => {
      tests++;
      const info = KifuInfo.fromJS({ timeLimits: 600 });
      strictEqual(info.getSGFProperties(), 'TM[600]');
    });

    it('Property OT', () => {
      tests++;
      const info = KifuInfo.fromJS({ overTime: '5x30 byo-yomi' });
      strictEqual(info.getSGFProperties(), 'OT[5x30 byo-yomi]');
    });

    it('Property RU', () => {
      tests++;
      const info = KifuInfo.fromJS({ rules: 'Japanese' });
      strictEqual(info.getSGFProperties(), 'RU[Japanese]');
    });

    it('Property SO', () => {
      tests++;
      const info = KifuInfo.fromJS({ source: 'Source' });
      strictEqual(info.getSGFProperties(), 'SO[Source]');
    });

    it('Property US', () => {
      tests++;
      const info = KifuInfo.fromJS({ author: 'User' });
      strictEqual(info.getSGFProperties(), 'US[User]');
    });

    it('Property AN', () => {
      tests++;
      const info = KifuInfo.fromJS({ annotator: 'Annotation' });
      strictEqual(info.getSGFProperties(), 'AN[Annotation]');
    });

    it('Property CP', () => {
      tests++;
      const info = KifuInfo.fromJS({ copyright: 'copyright' });
      strictEqual(info.getSGFProperties(), 'CP[copyright]');
    });

    it('Test of all property types', () => {
      strictEqual(tests, Object.keys(kifuInfoSGFPropertyDescriptors).length);
    });
  });

  describe('Configuring of Kifu info', () => {
    it('Adding custom properties', () => {
      KifuInfo.defineProperties({
        FF: {
          get(info: any) {
            return info.sgfVersion ? [String(info.sgfVersion)] : undefined;
          },
          set(info: any, [value]) {
            if (value) {
              info.sgfVersion = value;
            }
          },
        },
      });
      const info = KifuInfo.fromSGF('FF[4]GC[Game comment]');
      ok(info.getSGFProperties().indexOf('FF[4]') !== -1);
      strictEqual((info as any).sgfVersion, '4');
    });
  });
});
