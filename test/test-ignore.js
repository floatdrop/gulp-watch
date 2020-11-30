/* global describe, it, afterEach */

const watch = require('..');
const join = require('path').join;
const rimraf = require('rimraf');
const touch = require('./util/touch');
const fs = require('fs');
// eslint-disable-next-line import/no-unassigned-import
require('should');

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
