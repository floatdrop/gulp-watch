/* global beforeEach, afterEach, describe, it */

var path = require('path');
var proxyquire = require('proxyquire');

var fancyLogStub = {
	info: () => { }
};
var watch = proxyquire('..', {
	'fancy-log': fancyLogStub
});
var sinon = require('sinon');
var strip = require('strip-ansi');
var should = require('should');
var touch = require('./util/touch');

function fixtures(glob) {
	return path.join(__dirname, 'fixtures', glob);
}

describe('log', () => {
	let w;

	beforeEach(() => {
		sinon.spy(fancyLogStub, 'info');
	});

	afterEach(done => {
		fancyLogStub.info.restore();
		w.on('end', done);
		w.close();
	});

	it('should print file name', done => {
		w = watch(fixtures('*.js'), {verbose: true});
		w.once('data', () => {
			should(fancyLogStub.info.calledOnce).be.eql(true);
			should(strip(fancyLogStub.info.firstCall.args.join(' '))).eql('index.js was changed');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should print relative file name', done => {
		w = watch(fixtures('**/*.js'), {verbose: true});
		w.once('data', () => {
			should(strip(fancyLogStub.info.firstCall.args.join(' '))).eql(path.normalize('folder/index.js') + ' was changed');
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});

	it('should print custom watcher name', done => {
		w = watch(fixtures('*.js'), {name: 'Watch', verbose: true});
		w.once('data', () => {
			should(fancyLogStub.info.calledOnce).be.eql(true);
			should(strip(fancyLogStub.info.firstCall.args.join(' '))).eql('Watch saw index.js was changed');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});
});
