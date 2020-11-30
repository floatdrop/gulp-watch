/* global describe, it */

const watch = require('..');
const join = require('path').join;
// eslint-disable-next-line import/no-unassigned-import
require('should');

function fixtures(glob) {
	return join(__dirname, 'fixtures', glob);
}

describe('opts', () => {
	it('should not mutate the options object', () => {
		const options = {};
		watch(fixtures('index.js'), options).close();
		options.should.have.keys(...[]);
	});
});
