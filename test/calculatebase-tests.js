/* global describe, it */
'use strict';

delete require.cache[require.resolve('..')];
var watch = require('..'),
    path = require('path'),
    should = require('should');

var file = function (p) {
    return { cwd: process.cwd(), path: path.join(process.cwd(), p) };
};

describe('calculateBase', function () {
    var calculateBase = watch.calculateBase;

    it('should skip negatives in globs', function () {
        calculateBase(file('source/dir/file.txt'), ['source/**/*.*', '!**/#*#'])
            .should.eql('source/');
    });

    it('should fix base from array of globs', function () {
        calculateBase(file('test/fixtures/scss/test.scss'), ['test/fixtures/**/*.scss'])
            .should.eql('test/fixtures/');
    });

    it('should fix base from string glob', function () {
        calculateBase(file('test/fixtures/scss/test.scss'), 'test/fixtures/**/*.scss')
            .should.eql('test/fixtures/');
    });

    it('should work without cwd', function () {
        calculateBase(file('test/fixtures/scss/test.scss'), ['test/fixtures/**/*.scss'])
            .should.eql('test/fixtures/');
    });

    it('should skip unknown files', function () {
        var base = calculateBase(file('test/fixtures/scss/test.scs'), ['test/fixtures/**/*.scss']);
        should.not.exist(base);
    });
});
