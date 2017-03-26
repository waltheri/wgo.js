/**
 * Simple events handling.
 */
 
 export default class EventEmitter {
	constructor() {
		this.__events = {};
	}
	
	on(evName, callback) {
		this.__events[evName] = this.__events[evName] || [];
		this.__events[evName].push(callback);
	}
	
	off(evName, callback) {
		if(this.__events[evName]) {
			if(callback == null) this.__events[evName] = [];
			this.__events[evName] = this.__events[evName].filter((fn) => fn != callback);
		}
	}
	
	trigger(evName, payload) {
		if(this.__events[evName]) {
			this.__events[evName].forEach((fn) => fn(payload));
		}
	}
}
