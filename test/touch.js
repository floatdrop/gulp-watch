var fs = require('fs');

module.exports = function touch(path, content) {
    return function () {
        setTimeout(function () {
            fs.writeFileSync(path, content || 'wadap');
        }, 1000);
    };
};
