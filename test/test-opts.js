/* global describe, it */

var watch = require('..');
var join = require('path').join;
require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('opts', function () {
	it('should not mutate the options object', function () {
		var opts = {};
		watch(fixtures('index.js'), opts).close();
		opts.should.have.keys([]);
	});
});
