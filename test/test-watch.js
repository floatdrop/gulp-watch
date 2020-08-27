/* global describe, it */

const watch = require('..');
const join = require('path').join;
// eslint-disable-next-line import/no-unassigned-import
require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('watch', () => {
	it('should throw on invalid glob argument', () => {
		// eslint-disable-next-line no-use-extend-native/no-use-extend-native
		(function () {
			watch();
		}).should.throw();
		// eslint-disable-next-line no-use-extend-native/no-use-extend-native
		(function () {
			watch(1);
		}).should.throw();
		// eslint-disable-next-line no-use-extend-native/no-use-extend-native
		(function () {
			watch({});
		}).should.throw();
	});

	it('should return passThrough stream', done => {
		const stream = watch(fixtures('*.js'));
		stream.on('data', object => {
			object.should.be.eql(1);
			stream.on('end', done);
			stream.close();
		});
		stream.write(1);
	});
});
