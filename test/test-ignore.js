/* global describe, it, afterEach */

var watch = require('..');
var {join} = require('path');
var rimraf = require('rimraf');
var touch = require('./util/touch');
var fs = require('fs');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('ignore', () => {
	let w;

	afterEach(done => {
		w.on('end', () => {
			rimraf.sync(fixtures('temp'));
			done();
		});
		w.close();
	});

	it('should ignore files', done => {
		w = watch([fixtures('**/*.ts'), '!**/*.js'], () => {
			done('Ignored file was watched');
		});

		w.on('ready', () => {
			fs.mkdirSync(fixtures('temp'));
			touch(fixtures('temp/index.js'))();
			setTimeout(done, 200);
		});
	});
});
