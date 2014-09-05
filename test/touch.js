var fs = require('fs');

module.exports = function touch(path) {
    return function () {
        fs.writeFileSync(path, 'wadap');
    };
};
