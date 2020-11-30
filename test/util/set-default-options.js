'use strict';

const watch = require('../..');

if (process.platform === 'win32') {
	watch._defaultOptions.ignorePermissionErrors = true;
}
