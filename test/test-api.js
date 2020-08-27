/* global describe, it, afterEach */
/* eslint max-nested-callbacks: [1, 5] */

const fs = require('fs');
const watch = require('..');
const join = require('path').join;
const touch = require('./util/touch');
const rimraf = require('rimraf');
// eslint-disable-next-line import/no-unassigned-import
require('should');

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
				file.path.should.eql(fixtures('index.js'));
				done();
			}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
		});

		it('should normalize reported paths for modified files with non-normalized relative glob', done => {
			w = watch('test/fixtures/../fixtures/*.js', file => {
				file.path.should.eql(fixtures('index.js'));
				done();
			}).on('ready', touch(fixtures('index.js'), 'fixtures index'));
		});

		it('should normalize reported paths for removed files with non-normalized absolute glob', done => {
			touch(fixtures('index.js'), 'fixtures index', () => {
				w = watch(fixtures('../fixtures/*.js'), file => {
					file.path.should.eql(fixtures('index.js'));
					done();
				}).on('ready', () => {
					fs.unlinkSync(fixtures('index.js'));
				});
			})();
		});

		it('should normalize reported paths for removed files with non-normalized relative glob', done => {
			touch(fixtures('index.js'), 'fixtures index', () => {
				w = watch('test/fixtures/../fixtures/*.js', file => {
					file.path.should.eql(fixtures('index.js'));
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
				file.relative.should.eql('new.js');
				file.event.should.eql('add');
				done();
			}).on('ready', touch(fixtures('new.js')));
		});

		it('should emit change event on file change', done => {
			w = watch(fixtures('*/*.js'));
			w.add(fixtures('*.js'));
			w.on('ready', touch(fixtures('index.js')));
			w.on('data', file => {
				file.relative.should.eql('index.js');
				done();
			});
		});
	});
});
