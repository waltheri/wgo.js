/**
 * Simple base class for event handling. It tries to follow Node.js EventEmitter class API,
 * but contains only basic methods.
 */
export default class EventEmitter {
    private _events;
    on(evName: string, callback: Function): void;
    off(evName: string, callback: Function): void;
    emit(evName: string, ...args: any[]): void;
}
