'use strict';
var utils = {},
    fs = require('fs');

utils.touchFiles = function touchFiles(glob, done) {
    var gs = require('glob-stream');
    gs.create(glob)
        .on('data', function (file) {
            var data = fs.readFileSync(file.path);
            fs.writeFileSync(file.path, data);
        })
        .on('end', done || function () { });
};

module.exports = utils;
