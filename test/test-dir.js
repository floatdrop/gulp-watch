/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('./util/touch');
var should = require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('dir', () => {
	let w;

	afterEach(done => {
		w.on('end', () => {
			rimraf.sync(fixtures('newDir'));
			done();
		});
		w.close();
	});

	it('should watch files inside directory', done => {
		fs.mkdirSync(fixtures('newDir'));
		touch(fixtures('newDir/index.js'))();
		w = watch(fixtures('newDir'), file => {
			should(file.relative).eql(path.normalize('newDir/index.js'));
			done();
		}).on('ready', () => {
			touch(fixtures('newDir/index.js'))('new content');
		});
	});

	it('should watch directory creation');

	it('should watch directory removal');
});
