/* global describe, it */
'use strict';

delete require.cache[require.resolve('..')];
var watch = require('..'),
    path = require('path'),
    should = require('should');

describe('calculateBase', function () {
    it('should fix base from glob', function () {
        watch.calculateBase(['test/fixtures/**/*.scss'], {
            cwd: process.cwd(),
            path: path.join(process.cwd(), 'test/fixtures/scss/test.scss')
        }).should.eql('test/fixtures/');
    });

    it('should work without cwd', function () {
        watch.calculateBase(['test/fixtures/**/*.scss'], {
            path: path.join(process.cwd(), 'test/fixtures/scss/test.scss')
        }).should.eql('test/fixtures/');
    });

    it('should skip unknown files', function () {
        var result = watch.calculateBase(['test/fixtures/**/*.scss'], {
            cwd: process.cwd(),
            path: path.join(process.cwd(), 'test/fixtures/scss/test.scs')
        });
        should.not.exist(result);
    });
});
