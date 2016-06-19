/* global describe, it, afterEach */

var watch = require('..');
var join = require('path').join;
var rimraf = require('rimraf');
var touch = require('./touch.js');
var fs = require('fs');
require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('ignore', function () {
	var w;

	afterEach(function (done) {
		w.on('end', function () {
			rimraf.sync(fixtures('temp'));
			done();
		});
		w.close();
	});

	it('should ignore files', function (done) {
		w = watch([fixtures('**/*.ts'), '!**/*.js'], function () {
			done('Ignored file was watched');
		});

		w.on('ready', function () {
			fs.mkdirSync(fixtures('temp'));
			touch(fixtures('temp/index.js'))();
			setTimeout(done, 200);
		});
	});
});
