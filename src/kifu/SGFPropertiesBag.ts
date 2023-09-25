import { PropIdent, SGFParser, SGFProperties } from '../SGFParser';

interface SGfPropertyReaders<T extends SGFPropertiesBag> {
  [propIdent: string]: (node: T, value: string) => void;
}

interface SGfPropertyWriters<T extends SGFPropertiesBag> {
  [propIdent: string]: (node: T) => string[] | undefined;
}

/**
 * Properties bag for sgf node
 */
export default abstract class SGFPropertiesBag {
  abstract sgfPropertyReaders: SGfPropertyReaders<this>;

  abstract sgfPropertyWriters: SGfPropertyWriters<this>;

  properties: { [key: string]: unknown } = {};

  /**
   * Sets properties from the SGF properties object (as returned by SGF parser). This can override existing
   * properties, but it doesn't remove them. You can specify string with SGF node too, in that case it will parsed
   * into `SGFProperties`.
   *
   * @param sgfProperties
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

  /**
   * Sets one property in SGF format. This can override existing properties, but it doesn't remove them.
   *
   * @param propIdent
   * @param value
   */
  setSGFProperty(propIdent: PropIdent, propValues: string[]) {
    if (!(propIdent in this.sgfPropertyReaders)) {
      this.properties[propIdent] = propValues;
      return;
    }

    propValues.forEach((propValue) => this.sgfPropertyReaders[propIdent](this, propValue));
  }

  /**
   * Returns node in SGF format. Returned string won't contain semicolon at the beginning for practical reasons.
   */
  toSGF(): string {
    let sgf = '';

    Object.keys(this.sgfPropertyWriters).forEach((propIdent) => {
      const values = this.sgfPropertyWriters[propIdent](this);
      if (values && values.length) {
        sgf += `${propIdent}${values.map((v) => `[${v}]`).join('')}`;
      }
    });

    return sgf;
  }
}
