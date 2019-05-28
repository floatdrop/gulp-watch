/* global describe, it, afterEach */

var watch = require('..');
var {join} = require('path');
var touch = require('./util/touch');
var fs = require('fs');
var rimraf = require('rimraf');
var should = require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('stream', () => {
	let w;

	afterEach(done => {
		w.on('end', () => {
			rimraf.sync(fixtures('new.js'));
			done();
		});
		w.close();
	});

	it('should emit ready and end', done => {
		w = watch(fixtures('*.js'));
		w.on('ready', () => {
			done();
		});
	});

	it('should emit added file', done => {
		w = watch('test/fixtures/*.js');
		w.on('data', file => {
			should(file.relative).eql('new.js');
			should(file.event).eql('add');
			done();
		}).on('ready', touch(fixtures('new.js')));
	});

	it('should emit change event on file change', done => {
		w = watch(fixtures('*.js'));
		w.on('ready', touch(fixtures('index.js')));
		w.on('data', file => {
			should(file.relative).eql('index.js');
			done();
		});
	});

	it('should emit changed file with stream contents', done => {
		w = watch(fixtures('*.js'), {buffer: false});
		w.on('data', file => {
			should(file.contents).have.property('readable', true);
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should emit changed file with stats', done => {
		w = watch(fixtures('*.js'), {buffer: false});
		w.on('data', file => {
			should(file).have.property('stat');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it.skip('should emit deleted file with stats', done => {
		touch(fixtures('created.js'), () => {
			w = watch(fixtures('**/*.js'), {buffer: false});
			w.on('data', file => {
				should(file).have.property('contents', null);
				done();
			}).on('ready', () => {
				fs.unlinkSync(fixtures('created.js'));
			});
		})();
	});
});
