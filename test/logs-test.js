/* global describe, it, beforeEach, afterEach */
'use strict';

var proxyquire = require('proxyquire'),
    gutil = require('gulp-util'),
    gutilStub = {
        log: function() {}
    },
    watch = proxyquire('..', {
        'gulp-util': gutilStub
    }),
    sinon = require('sinon'),
    should = require('should'),
    gulp = require('gulp');

describe('logging', function () {
    beforeEach(function() {
        sinon.spy(gutilStub, 'log');
    });

    afterEach(function() {
        gutilStub.log.restore();
    });

    function assertSimpleCall() {
        gutilStub.log.calledTwice.should.be.true;

        var firstCall = gutilStub.log.firstCall;
        var secondCall = gutilStub.log.secondCall;

        firstCall.args[0].should.equal(gutil.colors.magenta('test.js'));
        firstCall.args[1].should.equal('was');
        firstCall.args[2].should.equal('added to watch');

        secondCall.args[0].should.equal(gutil.colors.magenta('1 file'));
        secondCall.args[1].should.equal('was');
        secondCall.args[2].should.equal('added from pipe');
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
            gutilStub.log.calledTwice.should.be.true;

            var firstCall = gutilStub.log.firstCall;
            var secondCall = gutilStub.log.secondCall;

            firstCall.args[0].should.equal(gutil.colors.cyan(name) + ' saw');
            firstCall.args[1].should.equal(gutil.colors.magenta('test.js'));
            firstCall.args[2].should.equal('was');
            firstCall.args[3].should.equal('added to watch');

            secondCall.args[0].should.equal(gutil.colors.cyan(name) + ' saw');
            secondCall.args[1].should.equal(gutil.colors.magenta('1 file'));
            secondCall.args[2].should.equal('was');
            secondCall.args[3].should.equal('added from pipe');

            w.on('end', done);
            w.close();
        });
    });
});
