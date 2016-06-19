/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('cwd', function () {
	var w;

	afterEach(function (done) {
		w.on('end', done);
		w.close();
	});

	it('should respect opts.cwd', function (done) {
		w = watch('index.js', {cwd: fixtures('')}, function (file) {
			file.relative.should.eql('index.js');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should emit file outside opts.cwd using relative glob', function (done) {
		w = watch('../index.js', {cwd: fixtures('folder')}, function (file) {
			file.relative.should.eql('index.js');
			file.contents.toString().should.equal('fixtures index');
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should emit file outside opts.cwd using absolute glob', function (done) {
		w = watch(fixtures('index.js'), {cwd: fixtures('folder')}, function (file) {
			file.relative.should.eql('index.js');
			file.contents.toString().should.equal('fixtures index');
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});
});
