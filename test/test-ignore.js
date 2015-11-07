/* global describe, it, before, after */

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

	before(function () {
		rimraf.sync(fixtures('temp'));
	});

	it('should ignore non-existent folders', function (done) {
		w = watch([fixtures('**/*.ts'), '!**/*.js'], function () {
			done('Ignored folder was watched');
		});

		w.on('ready', function () {
			fs.mkdirSync(fixtures('temp'));
			touch(fixtures('temp/index.js'))();
			setTimeout(done, 200);
		});
	});

	after(function () {
		rimraf.sync(fixtures('temp'));
	});
});
