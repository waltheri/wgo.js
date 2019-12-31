/**
 * Simple base class for event handling. It tries to follow Node.js EventEmitter class API,
 * but contains only basic methods.
 */
export default class EventEmitter {
  // tslint:disable-next-line:variable-name
  private _events: {[eventName: string]: Function[]} = {};

  on(evName: string, callback: Function) {
    this._events[evName] = this._events[evName] || [];
    this._events[evName].push(callback);
  }

  off(evName: string, callback: Function) {
    if (this._events[evName]) {
      if (callback == null) {
        this._events[evName] = [];
      }
      this._events[evName] = this._events[evName].filter(fn => fn !== callback);
    }
  }

  emit(evName: string, ...args: any[]) {
    if (this._events[evName]) {
      this._events[evName].forEach(fn => fn(...args));
    }
  }
}
