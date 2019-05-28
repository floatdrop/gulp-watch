/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var touch = require('./util/touch');
var should = require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('cwd', () => {
	let w;

	afterEach(done => {
		w.on('end', done);
		w.close();
	});

	it('should respect opts.cwd', done => {
		w = watch('index.js', {cwd: fixtures('')}, file => {
			should(file.relative).eql('index.js');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should emit file outside opts.cwd using relative glob', done => {
		w = watch('../index.js', {cwd: fixtures('folder')}, file => {
			should(file.relative).eql('index.js');
			should(file.contents.toString()).equal('fixtures index');
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should emit file outside opts.cwd using absolute glob', done => {
		w = watch(fixtures('index.js'), {cwd: fixtures('folder')}, file => {
			should(file.relative).eql('index.js');
			should(file.contents.toString()).equal('fixtures index');
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized cwd and non-normalized relative glob', done => {
		w = watch('../fixtures/index.js', {cwd: fixtures('../util')}, file => {
			should(file.path).eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized cwd and non-normalized absolute glob', done => {
		w = watch(fixtures('../fixtures/index.js'), {cwd: fixtures('../util')}, file => {
			should(file.path).eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized relative glob outside implicit cwd', done => {
		var cwd = process.cwd();
		process.chdir(fixtures('../util'));
		w = watch('../fixtures/index.js', file => {
			process.chdir(cwd);
			should(file.path).eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized absolute glob outside implicit cwd', done => {
		var cwd = process.cwd();
		process.chdir(fixtures('../util'));
		w = watch(fixtures('../fixtures/index.js'), {cwd: fixtures('../util')}, file => {
			process.chdir(cwd);
			should(file.path).eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});
});
