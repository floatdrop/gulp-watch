'use strict';
var utils = {};

utils.touchFiles = function touchFiles(glob, done) {
    var gs = require('glob-stream');
    var touch = require('touch');
    gs.create(glob)
        .on('data', function (file) {
            touch.sync(file.path, { nocreate: true, time: new Date() });
        })
        .on('end', done || function () { });
};

module.exports = utils;
