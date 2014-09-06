var fs = require('fs');

module.exports = function touch(path, content) {
    return function () {
        fs.writeFileSync(path, content || 'wadap');
    };
};
