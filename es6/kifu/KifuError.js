/**
 * Class for errors happend during manipulation the Kifu object.
 * @extends Error
 */
export class KifuError {
	constructor(message) {
		var tempError = Error.apply(this);
		this.message = message;
		this.stack = tempError.stack;
	}
}

// a small ES5 hack because currently in ES6 you can't extend Errors
KifuError.prototype = Object.create(Error.prototype);
KifuError.prototype.constructor = KifuError;

export default KifuError;