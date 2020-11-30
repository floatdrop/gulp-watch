/* global describe, it, afterEach */

const watch = require('..');
const path = require('path');
const touch = require('./util/touch');
// eslint-disable-next-line import/no-unassigned-import
require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('base', () => {
	let w;

	afterEach(done => {
		w.on('end', done);
		w.close();
	});

	it('should be determined by glob', done => {
		w = watch(fixtures('**/*.js'), file => {
			file.relative.should.eql(path.normalize('folder/index.js'));
			file.base.should.eql(fixtures(''));
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});

	it('should be overridden by option', done => {
		const explicitBase = fixtures('folder');
		w = watch(fixtures('**/*.js'), {base: explicitBase}, file => {
			file.relative.should.eql('index.js');
			file.base.should.eql(explicitBase);
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});
});
