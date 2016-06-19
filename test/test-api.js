/* global describe, it, afterEach */

var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
var rimraf = require('rimraf');
require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('api', function () {
	var w;

	describe('add', function () {
		afterEach(function (done) {
			w.on('end', function () {
				rimraf.sync(fixtures('new.js'));
				done();
			});
			w.close();
		});

		it('should emit added file', function (done) {
			w = watch(fixtures('folder'));
			w.add(fixtures('*.js'));
			w.on('data', function (file) {
				file.relative.should.eql('new.js');
				file.event.should.eql('add');
				done();
			}).on('ready', touch(fixtures('new.js')));
		});

		it('should emit change event on file change', function (done) {
			w = watch(fixtures('*/*.js'));
			w.add(fixtures('*.js'));
			w.on('ready', touch(fixtures('index.js')));
			w.on('data', function (file) {
				file.relative.should.eql('index.js');
				done();
			});
		});
	});
});
