/* global describe, it, beforeEach, afterEach */
'use strict';

var proxyquire = require('proxyquire'),
    gutilStub = {
        log: function () {
          // console.log(arguments);
        }
    },
    watch = proxyquire('..', {
        'gulp-util': gutilStub
    }),
    sinon = require('sinon'),
    gulp = require('gulp'),
    utils = require('./utils');

String.prototype.stripAnsi = function () { return require('strip-ansi')(this); };

require('should');
describe('logging', function () {
    beforeEach(function () {
        sinon.spy(gutilStub, 'log');
    });

    afterEach(function () {
        gutilStub.log.restore();
    });

    it('should print changed message after every edit', function (done) {
        var file = 0;
        var watcher = watch({
                glob: 'test/fixtures/*',
                emitOnGlob: false
            })
            .on('data', function () { file++; })
            .on('data', function () {
                if (file === 1) { utils.touch('test/fixtures/test.js')(); }
                if (file === 2) {
                    gutilStub.log.calledTwice.should.be.eql(true);
                    gutilStub.log.firstCall.args.join(' ').stripAnsi().should.eql('test.js was changed');
                    gutilStub.log.secondCall.args.join(' ').stripAnsi().should.eql('test.js was changed');
                    watcher.on('end', done);
                    watcher.close();
                }
            });
        watcher.on('ready', utils.touch('test/fixtures/test.js'));
    });

    it('should work when verbose is true', function (done) {
        var path = 'test/fixtures/test.js';
        var w = gulp.src(path).pipe(watch({ verbose: true, silent: false }));
        w.on('finish', function () {
            gutilStub.log.calledThrice.should.be.eql(true);
            gutilStub.log.secondCall.args.join(' ').stripAnsi().should.eql('test.js was added to watch');
            gutilStub.log.thirdCall.args.join(' ').stripAnsi().should.eql('1 file was added from pipe');
            w.on('end', done);
            w.close();
        });
    });

    it('should work when name is specified', function (done) {
        var name = 'Test';
        var w = gulp.src('test/fixtures/test.js').pipe(watch({ name: name, verbose: true, silent: false }));
        w.on('finish', function () {
            gutilStub.log.calledThrice.should.be.eql(true);
            gutilStub.log.secondCall.args.join(' ').stripAnsi().should.eql(name + ' saw test.js was added to watch');
            gutilStub.log.thirdCall.args.join(' ').stripAnsi().should.eql(name + ' saw 1 file was added from pipe');
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
            gutilStub.log.calledOnce.should.be.eql(true);
            gutilStub.log.firstCall.args.join(' ').stripAnsi().should.eql('test.js was passed through');
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
            gutilStub.log.calledOnce.should.be.eql(true);
            gutilStub.log.firstCall.args.join(' ').stripAnsi().should.eql(name + ' saw test.js was passed through');
            done();
        }, 100);
    });
});
