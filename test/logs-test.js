/* global describe, it, beforeEach, afterEach */
'use strict';

var proxyquire = require('proxyquire'),
    gutil = require('gulp-util'),
    gutilStub = {
        log: function () {
          // console.log(arguments);
        }
    },
    watch = proxyquire('..', {
        'gulp-util': gutilStub
    }),
    sinon = require('sinon'),
    gulp = require('gulp');

require('should');
describe('logging', function () {
    beforeEach(function () {
        sinon.spy(gutilStub, 'log');
    });

    afterEach(function () {
        gutilStub.log.restore();
    });

    function assertSimpleCall(offset) {
        if (typeof offset !== 'number') {
            offset = 0;
        }
        gutilStub.log.calledThrice.should.be.true;

        var watchLogCall = gutilStub.log.secondCall;
        var pipeLogCall = gutilStub.log.thirdCall;

        watchLogCall.args[0 + offset].should.equal(gutil.colors.magenta('test.js'));
        watchLogCall.args[1 + offset].should.equal('was');
        watchLogCall.args[2 + offset].should.equal('added to watch');

        pipeLogCall.args[0 + offset].should.equal(gutil.colors.magenta('1 file'));
        pipeLogCall.args[1 + offset].should.equal('was');
        pipeLogCall.args[2 + offset].should.equal('added from pipe');
    }

    it('should work when verbose is true', function (done) {
        var path = 'test/fixtures/test.js';
        var w = gulp.src(path).pipe(watch({ verbose: true, silent: false }));
        w.on('finish', function () {
            assertSimpleCall();
            w.on('end', done);
            w.close();
        });
    });

    it('should work when name is specified', function (done) {
        var name = 'Test';
        var w = gulp.src('test/fixtures/test.js').pipe(watch({ name: name, verbose: true, silent: false }));
        w.on('finish', function () {
            var watchLogCall = gutilStub.log.secondCall;
            var pipeLogCall = gutilStub.log.thirdCall;

            assertSimpleCall(1);
            watchLogCall.args[0].should.equal(gutil.colors.cyan(name) + ' saw');
            pipeLogCall.args[0].should.equal(gutil.colors.cyan(name) + ' saw');

            w.on('end', done);
            w.close();
        });
    });


    it('should work when we do a direct watch', function (done) {
        watch({
            glob: 'test/fixtures/*.js',
            verbose: true,
            silent: false
        });
        setTimeout(function () {
            gutilStub.log.calledOnce.should.be.true;

            var processedCall = gutilStub.log.firstCall;
            processedCall.args[0].should.equal(gutil.colors.magenta('test.js'));
            processedCall.args[1].should.equal('was');
            processedCall.args[2].should.equal('passed through');
            done();
        }, 100);
    });

    it('should work when we do a direct watch with a name', function (done) {
        var name = 'Test';
        watch({
            glob: 'test/fixtures/*.js',
            verbose: true,
            silent: false,
            name: name
        });
        setTimeout(function () {
            gutilStub.log.calledOnce.should.be.true;

            var processedCall = gutilStub.log.firstCall;
            processedCall.args[0].should.equal(gutil.colors.cyan(name) + ' saw');
            processedCall.args[1].should.equal(gutil.colors.magenta('test.js'));
            processedCall.args[2].should.equal('was');
            processedCall.args[3].should.equal('passed through');
            done();
        }, 100);
    });
});
