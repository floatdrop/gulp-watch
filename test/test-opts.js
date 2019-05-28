/* global describe, it */
var watch = require('..');
var {join} = require('path');
var should = require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('opts', () => {
	it('should not mutate the options object', () => {
		var opts = {};
		watch(fixtures('index.js'), opts).close();
		should(opts).have.keys([]);
	});
});
