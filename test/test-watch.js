/* global describe, it */

var watch = require('..');
var {join} = require('path');
var should = require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('watch', () => {
	it('should throw on invalid glob argument', () => {
		should(() => watch()).throw();

		should(() => watch(1)).throw();

		should(() => watch({})).throw();
	});

	it('should return passThrough stream', done => {
		var stream = watch(fixtures('*.js'));
		stream.on('data', obj => {
			obj.should.be.eql(1);
			stream.on('end', done);
			stream.close();
		});
		stream.write(1);
	});
});
