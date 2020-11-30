/* global describe, it, afterEach */

const watch = require('..');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const touch = require('./util/touch');
// eslint-disable-next-line import/no-unassigned-import
require('should');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('callback', () => {
	let w;

	afterEach(done => {
		w.on('end', () => {
			rimraf.sync(fixtures('newDir'));
			done();
		});
		w.close();
	});

	it('should be called on add event', done => {
		w = watch(fixtures('*.js'), file => {
			file.relative.should.eql('index.js');
			file.event.should.eql('change');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should be called on non-glob pattern', done => {
		w = watch(fixtures('index.js'), file => {
			file.relative.should.eql('index.js');
			file.event.should.eql('change');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should be called on add event in new directory', done => {
		w = watch(fixtures('**/*.ts'), file => {
			file.relative.should.eql(path.normalize('newDir/index.ts'));
			done();
		}).on('ready', () => {
			fs.mkdirSync(fixtures('newDir'));
			touch(fixtures('newDir/index.ts'))();
		});
	});

	it('unlinked `file.path` should be absolute (absolute glob)', done => {
		fs.mkdirSync(fixtures('newDir'));
		touch(fixtures('newDir/index.ts'), () => {
			w = watch(fixtures('**/*.ts'), {base: 'newDir/'}, file => {
				file.path.should.eql(path.normalize(fixtures('newDir/index.ts')));
				done();
			}).on('ready', () => {
				fs.unlinkSync(fixtures('newDir/index.ts'));
			});
		})();
	});

	it('unlinked `file.path` should be absolute (relative glob)', done => {
		fs.mkdirSync(fixtures('newDir'));
		touch(fixtures('newDir/index.ts'), () => {
			w = watch('test/fixtures/**/*.ts', {base: 'newDir/'}, file => {
				file.path.should.eql(path.normalize(fixtures('newDir/index.ts')));
				done();
			}).on('ready', () => {
				fs.unlinkSync(fixtures('newDir/index.ts'));
			});
		})();
	});
});
