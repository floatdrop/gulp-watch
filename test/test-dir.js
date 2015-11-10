/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('dir', function () {
	var w;

	afterEach(function (done) {
		rimraf.sync(fixtures('newDir'));
		w.on('end', done);
		w.close();
	});

	it('should not watch files inside directory', function (done) {
		fs.mkdirSync(fixtures('newDir'));
		touch(fixtures('newDir/index.js'))();
		w = watch(fixtures('newDir'), function () {
			done('Watched unexpected file.');
		}).on('ready', function () {
			touch(fixtures('newDir/index.js'))('new content');
			setTimeout(done, 200);
		});
	});

	it('should watch directory creation');

	it('should watch directory removal');
});
