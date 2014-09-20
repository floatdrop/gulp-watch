/* global describe, it */

var watch = require('..');
var join = require('path').join;
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('watch', function () {
    it('should throw on invalid glob argument', function () {
        (function() { watch(); }).should.throw();
        (function() { watch(1); }).should.throw();
        (function() { watch({}); }).should.throw();
    });

    it('should return passThrough stream', function (done) {
        var stream = watch(fixtures('*.js'));
        stream.on('data', function (obj) {
            obj.should.be.eql(1);
            stream.on('end', done);
            stream.close();
        });
        stream.write(1);
    });

    it('should emit error, when callback is failed', function (done) {
        var stream = watch(fixtures('*.js'), function () {
            throw new Error('Bang!');
        });
        stream.on('error', function (err) {
            err.message.should.eql('Bang!');
            stream.on('end', done);
            stream.close();
        });
        stream.write(1);
    });

});
