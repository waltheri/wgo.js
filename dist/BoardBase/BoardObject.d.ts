export default class BoardObject<T> {
    type: string | T;
    zIndex: number;
    constructor(type: string | T);
}
