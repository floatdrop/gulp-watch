/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var touch = require('./util/touch');
var should = require('should');

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
			should(file.relative).eql(path.normalize('folder/index.js'));
			should(file.base).eql(fixtures(''));
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});

	it('should be overridden by option', done => {
		var explicitBase = fixtures('folder');
		w = watch(fixtures('**/*.js'), {base: explicitBase}, file => {
			should(file.relative).eql('index.js');
			should(file.base).eql(explicitBase);
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});
});
