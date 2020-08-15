/**
 * Represents generic board object specified by type, which can be painted on the board.
 * It contains z-index and opacity.
 */
export default class BoardObject {
    type: string;
    zIndex: number;
    opacity: number;
    constructor(type: string);
}
