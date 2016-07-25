/* global describe, it, afterEach */
/* eslint max-nested-callbacks: [1, 5] */

var fs = require('fs');
var watch = require('..');
var join = require('path').join;
var touch = require('./util/touch');
var rimraf = require('rimraf');
require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('api', function () {
	var w;

	afterEach(function (done) {
		w.on('end', function () {
			rimraf.sync(fixtures('new.js'));
			done();
		});
		w.close();
	});

	describe('Basic functionality', function () {
		it('should normalize reported paths for modified files with non-normalized absolute glob', function (done) {
			w = watch(fixtures('../fixtures/*.js'), function (file) {
				file.path.should.eql(fixtures('index.js'));
				done();
			}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
		});

		it('should normalize reported paths for modified files with non-normalized relative glob', function (done) {
			w = watch('test/fixtures/../fixtures/*.js', function (file) {
				file.path.should.eql(fixtures('index.js'));
				done();
			}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
		});

		it('should normalize reported paths for removed files with non-normalized absolute glob', function (done) {
			touch(fixtures('index.js'), 'fixtures index', function () {
				w = watch(fixtures('../fixtures/*.js'), function (file) {
					file.path.should.eql(fixtures('index.js'));
					done();
				}).on('ready', function () {
					fs.unlinkSync(fixtures('index.js'));
				});
			})();
		});

		it('should normalize reported paths for removed files with non-normalized relative glob', function (done) {
			touch(fixtures('index.js'), 'fixtures index', function () {
				w = watch('test/fixtures/../fixtures/*.js', function (file) {
					file.path.should.eql(fixtures('index.js'));
					done();
				}).on('ready', function () {
					fs.unlinkSync(fixtures('index.js'));
				});
			})();
		});
	});

	describe('add', function () {
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
