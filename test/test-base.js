/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var rimraf = require('rimraf');
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('base', function () {
	var w;

	afterEach(function (done) {
		rimraf.sync(fixtures('newDir'));
		w.on('end', done);
		w.close();
	});

	it('should be determined by glob', function (done) {
		w = watch(fixtures('**/*.js'), function (file) {
			file.relative.should.eql(path.normalize('folder/index.js'));
			file.base.should.eql(fixtures('/'));
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});

	it('should be overridden by option', function (done) {
		var explicitBase = fixtures('folder');
		w = watch(fixtures('**/*.js'), {base: explicitBase}, function (file) {
			file.relative.should.eql('index.js');
			file.base.should.eql(explicitBase);
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});
});
