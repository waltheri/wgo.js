import KifuNode from '../kifu/KifuNode';
/**
 * Helper class for storing data (temporary) to SGF properties.
 */
export default class PropertiesData {
    propertiesData: Map<KifuNode, {
        [propIdent: string]: any;
    }>;
    player: {
        currentNode: KifuNode;
    };
    constructor(player: {
        currentNode: KifuNode;
    });
    /**
     * Gets property data of current node - data are temporary not related to SGF.
     */
    get(propIdent: string, node?: KifuNode): any;
    /**
     * Sets property data of specified node.
     */
    set(propIdent: string, data: any, node?: KifuNode): void;
    /**
     * Clears property data of specified node.
     */
    clear(propIdent: string, node?: KifuNode): void;
}
