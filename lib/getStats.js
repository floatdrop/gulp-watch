var through2 = require('through2');
var fs = require('graceful-fs');

function fetchStats(file, enc, cb) {
  fs.stat(file.path, function (err, stat) {
    if (stat) {
      file.stat = stat;
    }
    cb(err, file);
  });
}

module.exports = function getStats() {
  return through2.obj(fetchStats);
};
