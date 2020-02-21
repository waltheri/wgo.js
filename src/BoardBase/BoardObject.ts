export default class BoardObject<T> {
  type: string | T;
  zIndex: number = 0;

  constructor(type: string | T) {
    this.type = type;
  }
}
