'use strict';

var watch = require('../..');

if (process.platform === 'win32') {
	watch._defaultOptions.ignorePermissionErrors = true;
}
