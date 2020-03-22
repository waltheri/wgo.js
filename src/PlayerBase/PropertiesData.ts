import KifuNode from '../kifu/KifuNode';

/**
 * Helper class for storing data (temporary) to SGF properties.
 */
export default class PropertiesData {
  // data bounded to SGF properties
  propertiesData: Map<KifuNode, { [propIdent: string]: any }>;
  player: { currentNode: KifuNode };

  constructor(player: { currentNode: KifuNode }) {
    // init properties data map
    this.propertiesData = new Map();
    this.player = player;
  }

  /**
   * Gets property data of current node - data are temporary not related to SGF.
   */
  get(propIdent: string, node = this.player.currentNode) {
    const currentNodeData = this.propertiesData.get(node);
    return currentNodeData ? currentNodeData[propIdent] : undefined;
  }

  /**
   * Sets property data of specified node.
   */
  set(propIdent: string, data: any, node = this.player.currentNode) {
    let currentNodeData = this.propertiesData.get(node);

    if (data == null) {
      if (currentNodeData) {
        delete currentNodeData[propIdent];
      }
    } else {
      if (!currentNodeData) {
        currentNodeData = {};
        this.propertiesData.set(node, currentNodeData);
      }
      currentNodeData[propIdent] = data;
    }
  }

  /**
   * Clears property data of specified node.
   */
  clear(propIdent: string, node = this.player.currentNode) {
    this.set(propIdent, null, node);
  }
}
