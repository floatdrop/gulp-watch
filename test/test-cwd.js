/* global describe, it, afterEach */

const watch = require('..');
const path = require('path');
const touch = require('./util/touch');
// eslint-disable-next-line import/no-unassigned-import
require('should');

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
			file.relative.should.eql('index.js');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should emit file outside opts.cwd using relative glob', done => {
		w = watch('../index.js', {cwd: fixtures('folder')}, file => {
			file.relative.should.eql('index.js');
			file.contents.toString().should.equal('fixtures index');
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should emit file outside opts.cwd using absolute glob', done => {
		w = watch(fixtures('index.js'), {cwd: fixtures('folder')}, file => {
			file.relative.should.eql('index.js');
			file.contents.toString().should.equal('fixtures index');
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized cwd and non-normalized relative glob', done => {
		w = watch('../fixtures/index.js', {cwd: fixtures('../util')}, file => {
			file.path.should.eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized cwd and non-normalized absolute glob', done => {
		w = watch(fixtures('../fixtures/index.js'), {cwd: fixtures('../util')}, file => {
			file.path.should.eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized relative glob outside implicit cwd', done => {
		const cwd = process.cwd();
		process.chdir(fixtures('../util'));
		w = watch('../fixtures/index.js', file => {
			process.chdir(cwd);
			file.path.should.eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});

	it('should normalized reported paths with non-normalized absolute glob outside implicit cwd', done => {
		const cwd = process.cwd();
		process.chdir(fixtures('../util'));
		w = watch(fixtures('../fixtures/index.js'), {cwd: fixtures('../util')}, file => {
			process.chdir(cwd);
			file.path.should.eql(fixtures('index.js'));
			done();
		}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
	});
});
