/* global describe, it, afterEach */

const watch = require('..');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const touch = require('./util/touch');
// eslint-disable-next-line import/no-unassigned-import
require('should');

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
			file.relative.should.eql(path.normalize('newDir/index.js'));
			done();
		}).on('ready', () => {
			touch(fixtures('newDir/index.js'))('new content');
		});
	});

	it('should watch directory creation');

	it('should watch directory removal');
});
