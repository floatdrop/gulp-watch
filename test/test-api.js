/* global describe, it, afterEach */
/* eslint max-nested-callbacks: [1, 5] */

var fs = require('fs');
var watch = require('..');
var {join} = require('path');
var rimraf = require('rimraf');
var should = require('should');
var touch = require('./util/touch');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('api', () => {
	let w;

	afterEach(done => {
		w.on('end', () => {
			rimraf.sync(fixtures('new.js'));
			done();
		});
		w.close();
	});

	describe('Basic functionality', () => {
		it('should normalize reported paths for modified files with non-normalized absolute glob', done => {
			w = watch(fixtures('../fixtures/*.js'), file => {
				should(file.path).eql(fixtures('index.js'));
				done();
			}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
		});

		it('should normalize reported paths for modified files with non-normalized relative glob', done => {
			w = watch('test/fixtures/../fixtures/*.js', file => {
				should(file.path).eql(fixtures('index.js'));
				done();
			}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
		});

		it('should normalize reported paths for removed files with non-normalized absolute glob', done => {
			touch(fixtures('index.js'), 'fixtures index', () => {
				w = watch(fixtures('../fixtures/*.js'), file => {
					should(file.path).eql(fixtures('index.js'));
					done();
				}).on('ready', () => {
					fs.unlinkSync(fixtures('index.js'));
				});
			})();
		});

		it('should normalize reported paths for removed files with non-normalized relative glob', done => {
			touch(fixtures('index.js'), 'fixtures index', () => {
				w = watch('test/fixtures/../fixtures/*.js', file => {
					should(file.path).eql(fixtures('index.js'));
					done();
				}).on('ready', () => {
					fs.unlinkSync(fixtures('index.js'));
				});
			})();
		});
	});

	describe('add', () => {
		it('should emit added file', done => {
			w = watch(fixtures('folder'));
			w.add(fixtures('*.js'));
			w.on('data', file => {
				should(file.relative).eql('new.js');
				should(file.event).eql('add');
				done();
			}).on('ready', touch(fixtures('new.js')));
		});

		it('should emit change event on file change', done => {
			w = watch(fixtures('*/*.js'));
			w.add(fixtures('*.js'));
			w.on('ready', touch(fixtures('index.js')));
			w.on('data', file => {
				should(file.relative).eql('index.js');
				done();
			});
		});
	});
});
