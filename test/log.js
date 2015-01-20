/* global beforeEach, afterEach, describe, it */

var proxyquire = require('proxyquire'),
    gutilStub = {
        log: function () { }
    },
    watch = proxyquire('..', {
        'gulp-util': gutilStub
    }),
    sinon = require('sinon');

var join = require('path').join;
var touch = require('./touch.js');
var strip = require('strip-ansi');

require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('log', function () {
    var w;

    beforeEach(function () {
        sinon.spy(gutilStub, 'log');
    });

    afterEach(function (done) {
        gutilStub.log.restore();
        w.on('end', done);
        w.close();
    });

    it('should print file name', function (done) {
        w = watch(fixtures('*.js'));
        w.once('data', function () {
            gutilStub.log.calledOnce.should.be.eql(true);
            strip(gutilStub.log.firstCall.args.join(' ')).should.eql('index.js was add');
            done();
        });
    });

    it('should print relative file name', function (done) {
        w = watch(fixtures('**/*.js'));
        w.on('data', function (file) {
            if (file.relative === 'folder/index.js') {
                strip(gutilStub.log.secondCall.args.join(' ')).should.eql('folder/index.js was add');
                done();
            }
        });
    });

    it('should print custom watcher name', function (done) {
        w = watch(fixtures('*.js'), { name: 'Watch' });
        w.on('ready', touch(fixtures('index.js')));
        w.once('data', function () {
            gutilStub.log.calledOnce.should.be.eql(true);
            strip(gutilStub.log.firstCall.args.join(' ')).should.eql('Watch saw index.js was add');
            done();
        });
    });

});
