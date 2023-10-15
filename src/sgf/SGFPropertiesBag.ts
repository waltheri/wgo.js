import { Point } from '../types';
import { SGFParser } from './SGFParser';
import { PropIdent, SGFProperties } from './sgfTypes';

export interface SGFPropertyDescriptors<T> {
  [propIdent: string]: {
    set(entity: T, value: string[]): void;
    get(entity: T): string[] | undefined;
  };
}

/**
 * TODO: better name?
 */
export abstract class SGFPropertiesBag {
  abstract getPropertyDescriptors(): SGFPropertyDescriptors<this>;

  abstract setUnknownSGFProperty(propIdent: string, propValues: string[]): void;

  /**
   * Process one SGF property.
   */
  setSGFProperty(propIdent: string, propValues: string[]) {
    const descriptors = this.getPropertyDescriptors();

    if (!(propIdent in descriptors)) {
      this.setUnknownSGFProperty(propIdent, propValues);
      return;
    }

    descriptors[propIdent].set(this, propValues);
  }

  /**
   * Process properties from the SGF properties object or SGF string.
   */
  setSGFProperties(sgfProperties: SGFProperties | string) {
    if (typeof sgfProperties === 'string') {
      const parser = new SGFParser();
      const parsedProperties = parser.parseNode(
        // Node must have semicolon at the beginning
        sgfProperties[0] === ';' ? sgfProperties : `;${sgfProperties}`,
      );

      this.setSGFProperties(parsedProperties);
      return;
    }

    (Object.keys(sgfProperties) as PropIdent[]).forEach((propIdent) => {
      this.setSGFProperty(propIdent, sgfProperties[propIdent]);
    });
  }

  getSGFProperties() {
    const descriptors = this.getPropertyDescriptors();
    let sgf = '';

    Object.keys(descriptors).forEach((propIdent) => {
      const values = descriptors[propIdent].get(this);
      if (values && values.length) {
        sgf += `${propIdent}${values.map((v) => `[${escapeSGFValue(v)}]`).join('')}`;
      }
    });

    return sgf;
  }

  static parsePoint(str: string) {
    return {
      x: str.charCodeAt(0) - 97,
      y: str.charCodeAt(1) - 97,
    };
  }

  static parseVector(str: string) {
    return {
      x1: str.charCodeAt(0) - 97,
      y1: str.charCodeAt(1) - 97,
      x2: str.charCodeAt(3) - 97,
      y2: str.charCodeAt(4) - 97,
    };
  }

  static pointToSGFValue(point: Point) {
    return String.fromCharCode(point.x + 97) + String.fromCharCode(point.y + 97);
  }

  static vectorToSGFValue(vector: { x1: number; y1: number; x2: number; y2: number }) {
    return `${String.fromCharCode(vector.x1 + 97) + String.fromCharCode(vector.y1 + 97)}:${
      String.fromCharCode(vector.x2 + 97) + String.fromCharCode(vector.y2 + 97)
    }`;
  }
}

// Characters, which has to be escaped when transforming to SGF
const escapeCharacters = ['\\\\', '\\]'];

const escapeSGFValue = function (value: string) {
  return escapeCharacters.reduce(
    (prev, current) => prev.replace(new RegExp(current, 'g'), current),
    value,
  );
};
