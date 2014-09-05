/* global describe, it */

var assert = require('stream-assert');
var watch = require('..');
var join = require('path').join;
require('should');

var fixtures = join(__dirname, 'fixtures/**/*.js');

describe('watch', function () {
    it('should watch files', function (done) {
        watch(fixtures)
            .pipe(assert.length(1))
            .on('end', done);
    });
});
