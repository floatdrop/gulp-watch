/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('./util/touch');
require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('callback', function () {
	var w;

	afterEach(function (done) {
		w.on('end', function () {
			rimraf.sync(fixtures('newDir'));
			done();
		});
		w.close();
	});

	it('should be called on add event', function (done) {
		w = watch(fixtures('*.js'), function (file) {
			file.relative.should.eql('index.js');
			file.event.should.eql('change');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should be called on non-glob pattern', function (done) {
		w = watch(fixtures('index.js'), function (file) {
			file.relative.should.eql('index.js');
			file.event.should.eql('change');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should be called on add event in new directory', function (done) {
		w = watch(fixtures('**/*.ts'), function (file) {
			file.relative.should.eql(path.normalize('newDir/index.ts'));
			done();
		}).on('ready', function () {
			fs.mkdirSync(fixtures('newDir'));
			touch(fixtures('newDir/index.ts'))();
		});
	});

	it('unlinked `file.path` should be absolute (absolute glob)', function (done) {
		fs.mkdirSync(fixtures('newDir'));
		touch(fixtures('newDir/index.ts'), function () {
			w = watch(fixtures('**/*.ts'), {base: 'newDir/'}, function (file) {
				file.path.should.eql(path.normalize(fixtures('newDir/index.ts')));
				done();
			}).on('ready', function () {
				fs.unlinkSync(fixtures('newDir/index.ts'));
			});
		})();
	});

	it('unlinked `file.path` should be absolute (relative glob)', function (done) {
		fs.mkdirSync(fixtures('newDir'));
		touch(fixtures('newDir/index.ts'), function () {
			w = watch('test/fixtures/**/*.ts', {base: 'newDir/'}, function (file) {
				file.path.should.eql(path.normalize(fixtures('newDir/index.ts')));
				done();
			}).on('ready', function () {
				fs.unlinkSync(fixtures('newDir/index.ts'));
			});
		})();
	});
});
