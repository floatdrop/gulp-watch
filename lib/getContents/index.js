'use strict';

var through2 = require('through2');

var bufferFile = require('./bufferFile');
var streamFile = require('./streamFile');

function getContents(opt) {
  return through2.obj(function (file, enc, cb) {
    if (file.isDirectory()) {
      return cb(null, file);
    }

    // read and pass full contents
    if (opt.buffer !== false) {
      return bufferFile(file, cb);
    }

    // dont buffer anything - just pass streams
    return streamFile(file, cb);
  });
}

module.exports = getContents;
