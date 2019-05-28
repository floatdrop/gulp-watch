/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('./util/touch');
var should = require('should');

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
			should(file.relative).eql('index.js');
			should(file.event).eql('change');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should be called on non-glob pattern', done => {
		w = watch(fixtures('index.js'), file => {
			should(file.relative).eql('index.js');
			should(file.event).eql('change');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should be called on add event in new directory', done => {
		w = watch(fixtures('**/*.ts'), file => {
			should(file.relative).eql(path.normalize('newDir/index.ts'));
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
				should(file.path).eql(path.normalize(fixtures('newDir/index.ts')));
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
				should(file.path).eql(path.normalize(fixtures('newDir/index.ts')));
				done();
			}).on('ready', () => {
				fs.unlinkSync(fixtures('newDir/index.ts'));
			});
		})();
	});
});
