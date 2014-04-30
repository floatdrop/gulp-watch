'use strict';
var utils = {
        es: require('event-stream')
    };

utils.defaults = function defaults(options) {
    options = options || {};
    options.timeout = options.timeout || 0;
    options.silent = options.silent || true;
    options.verbose = options.verbose || false;
    options.src = options.src || './test/fixtures/*.*';
    return options;
};

utils.touchFile = function (file) {
    setTimeout(function () {
        require('touch').sync(file, { nocreate: true, time: new Date() });
    }, 1000);
};

utils.touch = function touch(file, done) {
    return utils.touchFile.bind(null, file, done);
};

module.exports = utils;
