var fs = require('fs');

module.exports = function touch(path, content, cb) {
    if (typeof content === 'function') {
        cb = content;
        content = undefined;
    }

    cb = cb || function () {};

    return function () {
        fs.writeFileSync(path, content || 'wadap');
        cb();
    };
};
