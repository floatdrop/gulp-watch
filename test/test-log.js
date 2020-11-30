/* global beforeEach, afterEach, describe, it */

const proxyquire = require('proxyquire');
const fancyLogStub = {
	info() { }
};
const watch = proxyquire('..', {
	'fancy-log': fancyLogStub
});
const sinon = require('sinon');

const path = require('path');
const touch = require('./util/touch');
const strip = require('strip-ansi');

// eslint-disable-next-line import/no-unassigned-import
require('should');

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
			fancyLogStub.info.calledOnce.should.be.eql(true);
			strip(fancyLogStub.info.firstCall.args.join(' ')).should.eql('index.js was changed');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});

	it('should print relative file name', done => {
		w = watch(fixtures('**/*.js'), {verbose: true});
		w.once('data', () => {
			strip(fancyLogStub.info.firstCall.args.join(' ')).should.eql(path.normalize('folder/index.js') + ' was changed');
			done();
		}).on('ready', touch(fixtures('folder/index.js')));
	});

	it('should print custom watcher name', done => {
		w = watch(fixtures('*.js'), {name: 'Watch', verbose: true});
		w.once('data', () => {
			fancyLogStub.info.calledOnce.should.be.eql(true);
			strip(fancyLogStub.info.firstCall.args.join(' ')).should.eql('Watch saw index.js was changed');
			done();
		}).on('ready', touch(fixtures('index.js')));
	});
});
