var fs = require('fs');

module.exports = function touch(path, content, cb) {
    if (typeof content === 'function') {
        cb = content;
        content = undefined;
    }

    cb = cb || function () {};

    return function () {
        setTimeout(function () {
            fs.writeFileSync(path, content || 'wadap');
            cb();
        }, 1000);
    };
};
