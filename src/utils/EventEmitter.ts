/**
 * Simple event interface.
 */
interface Event<T> {
  target: T;
  type: string;
}

/**
 * Simple base class for event handling. It is similar to Node.js EventEmitter class API,
 * but contains only basic methods and is not as robust - for example when calling `off`,
 * all listeners are removed (not just the first occurrence). On the other hand, this allows
 * better typings.
 */
export class EventEmitter<T = any> {
  #events: { [eventName: string | symbol]: Array<(event: any) => void> } = {};

  on<E extends keyof T>(event: E, listener: (event: Event<this> & T[E]) => void): this;
  on(event: string, listener: (event: Event<this> & { [key: string]: any }) => void): this;
  on(event: string, listener: (event: any) => void) {
    this.#events[event] = this.#events[event] || [];
    this.#events[event].push(listener);

    return this;
  }

  off<E extends keyof T>(event: E, listener: (event: Event<this> & T[E]) => void): this;
  off(event: string, listener: (event: Event<this> & { [key: string]: any }) => void): this;
  off(event: string, listener: (event: any) => void) {
    if (this.#events[event]) {
      this.#events[event] = this.#events[event].filter((fn) => fn !== listener);
    }

    return this;
  }

  emit<E extends keyof T>(event: E, payload?: T[E]): boolean;
  emit<E extends string>(
    event: E extends keyof T ? never : E,
    payload?: { [key: string]: any },
  ): boolean;
  emit(event: string, payload: any = {}) {
    if (this.#events[event]) {
      this.#events[event].forEach((fn) => fn({ target: this, type: event, ...payload }));

      return true;
    }

    return false;
  }
}
